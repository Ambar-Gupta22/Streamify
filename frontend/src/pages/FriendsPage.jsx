import { useEffect, useState } from "react"
import useAuthUser from "../hooks/useAuthUser"
import { useQuery } from "@tanstack/react-query"
import { StreamChat } from "stream-chat"
import NoFriendsFound from "../components/NoFriendsFound"
import { getStreamToken, getUserFriends } from "../lib/api"
import FriendSectionCard from "../components/FriendSectionCard"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const FriendsPage = () => {
  const { authUser } = useAuthUser()
  const [chatClient, setChatClient] = useState(null)
  const [friendsWithPresence, setFriendsWithPresence] = useState([])

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  })

  const { data: tokenData, isLoading: tokenLoading, error: tokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

  // Initialize Stream Chat client
  useEffect(() => {
    if (!tokenData?.token || !authUser) return

    const initClient = async () => {
      const client = StreamChat.getInstance(STREAM_API_KEY)
      try {
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        )
        setChatClient(client)
      } catch (err) {
        console.error("StreamChat connection error:", err)
      }
    }

    initClient()

    return () => {
      if (chatClient) {
        chatClient.disconnectUser()
        setChatClient(null)
      }
    }
  }, [tokenData, authUser])

  // Add presence info to friends
  useEffect(() => {
    if (!chatClient || friends.length === 0) return

    const updatePresence = async () => {
      try {
        const { users } = await chatClient.queryUsers(
          { id: { $in: friends.map((f) => f._id) } },
          {},
          { presence: true }
        )

        // Map presence data to your original friends
        const updatedFriends = friends.map((friend) => {
          const user = users.find((u) => u.id === friend._id);
          return {
            ...friend,
            online: user?.online || false,
            last_active: user?.last_active || null,
          }
        })

        setFriendsWithPresence(updatedFriends)
      } catch (err) {
        console.error("Failed to query presence data:", err);
        setFriendsWithPresence(friends); // fallback
      }
    }

    updatePresence()

    chatClient.on("user.presence.changed", (event) => {
      setFriendsWithPresence((prev) =>
        prev.map((f) =>
          f._id === event.user.id
            ? { ...f, online: event.user.online, last_active: event.user.last_active }
            : f
        )
      )
    })

    return () => {
      chatClient.off("user.presence.changed")
    }
  }, [chatClient, friends])

  if (tokenLoading || loadingFriends) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-100 p-4">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-100 p-4">
        <p className="text-red-500">Failed to load chat token.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
        </div>

        {friendsWithPresence.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friendsWithPresence.map((friend) => (
              <FriendSectionCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendsPage