import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-gray-400">User information not available</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
      
      <div className="space-y-3">
        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p className="text-white">{user.firstName} {user.lastName}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">Email</p>
          <p className="text-white">{user.email}</p>
        </div>
        
        {user.createdAt && (
          <div>
            <p className="text-gray-400 text-sm">Account Created</p>
            <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
