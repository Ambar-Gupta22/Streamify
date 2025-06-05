import { Link } from "react-router"
import { getLanguageFlag } from "./FriendCard" 

const FriendSectionCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
            {/* ONLINE/OFFLINE STATUS INDICATOR */}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100
              ${friend.online ? "bg-green-500" : "bg-gray-400"}`}
              title={friend.online ? "Online" : "Offline"}
            />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* BADGES: Native & Learning (inline, no wrapping) */}
        <div className="flex gap-2 mb-3 flex-nowrap overflow-hidden max-w-full">
          <span className="badge badge-secondary text-xs whitespace-nowrap">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs whitespace-nowrap">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* MESSAGE BUTTON */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  )
}

export default FriendSectionCard
