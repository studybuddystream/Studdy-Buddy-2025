// import React from 'react';

// const ProfilePage = ({ user, studyHours, streak, connectedFriends = [] }) => {
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//           <p className="text-lg text-gray-600">No user data available.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         {/* Profile Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-green-800">Profile</h1>
//           <p className="text-lg text-gray-600">Welcome back, {user.name}!</p>
//         </div>

//         {/* User Details Section */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-green-800 mb-4">Personal Information</h2>
//           <div className="space-y-4">
//             <div className="bg-green-100 p-4 rounded-lg shadow-sm">
//               <p className="text-lg text-gray-700">
//                 <span className="font-semibold">Name:</span> {user.name}
//               </p>
//             </div>
//             <div className="bg-green-100 p-4 rounded-lg shadow-sm">
//               <p className="text-lg text-gray-700">
//                 <span className="font-semibold">Email:</span> {user.email}
//               </p>
//             </div>
//             <div className="bg-green-100 p-4 rounded-lg shadow-sm">
//               <p className="text-lg text-gray-700">
//                 <span className="font-semibold">Mobile Number:</span> {user.mobileNumber}
//               </p>
//             </div>
//             <div className="bg-green-100 p-4 rounded-lg shadow-sm">
//               <p className="text-lg text-gray-700">
//                 <span className="font-semibold">Address:</span> {user.address}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Dashboard Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* Study Hours Card */}
//           <div className="bg-green-100 p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold text-green-800">Study Hours</h2>
//             <p className="text-lg text-gray-700">{studyHours} hours</p>
//           </div>

//           {/* Streak Card */}
//           <div className="bg-green-100 p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold text-green-800">Streak</h2>
//             <p className="text-lg text-gray-700">{streak} days</p>
//           </div>
//         </div>

//         {/* Connected Friends Section */}
//         <div className="bg-green-100 p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-green-800 mb-4">Connected Friends</h2>
//           {connectedFriends.length > 0 ? (
//             <ul className="space-y-2">
//               {connectedFriends.map((friend) => (
//                 <li key={friend.id} className="bg-white p-4 rounded-lg shadow-sm">
//                   <p className="text-lg text-gray-700">{friend.name}</p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-lg text-gray-600">No friends connected yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// // import React, { useContext } from 'react';
// // import { Navigate } from 'react-router-dom';
// // import { AuthContext } from '../AuthContext';

// // const ProfilePage = () => {
// //   const { isAuthenticated, user } = useContext(AuthContext);

// //   // Redirect to sign-up page if the user is not authenticated
// //   if (!isAuthenticated) {
// //     return <Navigate to="/signup" />;
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6">
// //       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
// //         <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
// //           Profile
// //         </h1>

// //         {/* User Details */}
// //         <div className="space-y-4">
// //           <div className="bg-green-100 p-4 rounded-lg shadow-sm">
// //             <p className="text-lg text-gray-700">
// //               <span className="font-semibold">Name:</span> {user.name}
// //             </p>
// //           </div>
// //           <div className="bg-green-100 p-4 rounded-lg shadow-sm">
// //             <p className="text-lg text-gray-700">
// //               <span className="font-semibold">Email:</span> {user.email}
// //             </p>
// //           </div>
// //           <div className="bg-green-100 p-4 rounded-lg shadow-sm">
// //             <p className="text-lg text-gray-700">
// //               <span className="font-semibold">Study Hours:</span> {user.studyHours} hours
// //             </p>
// //           </div>
// //           <div className="bg-green-100 p-4 rounded-lg shadow-sm">
// //             <p className="text-lg text-gray-700">
// //               <span className="font-semibold">Streak:</span> {user.streak} days
// //             </p>
// //           </div>
// //           <div className="bg-green-100 p-4 rounded-lg shadow-sm">
// //             <p className="text-lg text-gray-700">
// //               <span className="font-semibold">Connected Friends:</span>{' '}
// //               {user.connectedFriends?.join(', ')}
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

// Define getProfileUser function
const getProfileUser = (user, studyHours = 0, streak = 0, connectedFriends = []) => {
  return {
    username: user.name || user.username || 'Unknown User', // Fallback for username
    email: user.email || 'N/A',
    mobileNumber: user.mobileNumber || 'N/A',
    address: user.address || 'N/A',
    bio: user.bio || 'No bio yet', // For Circle compatibility
    following: user.following || [], // For Circle compatibility
    bookmarks: user.bookmarks || [], // For Circle compatibility
    studyHours: studyHours || user.studyHours || 0,
    streak: streak || user.streak || 0,
    connectedFriends: connectedFriends.length > 0 ? connectedFriends : user.connectedFriends || [],
  };
};

// Define ProfilePage component
const ProfilePage = ({ studyHours = 0, streak = 0, connectedFriends = [] }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Redirect to sign-in (not sign-up) if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  // If user data is not available, show a loading message
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Use getProfileUser to create the profileUser object
  const profileUser = getProfileUser(user, studyHours, streak, connectedFriends);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800">Profile</h1>
          <p className="text-lg text-gray-600">Welcome back, {profileUser.username}!</p>
        </div>

        {/* User Details Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="bg-green-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Username:</span> {profileUser.username}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Email:</span> {profileUser.email}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Mobile Number:</span> {profileUser.mobileNumber}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Address:</span> {profileUser.address}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Bio:</span> {profileUser.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Study Hours Card */}
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-800">Study Hours</h2>
            <p className="text-lg text-gray-700">{profileUser.studyHours} hours</p>
          </div>

          {/* Streak Card */}
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-800">Streak</h2>
            <p className="text-lg text-gray-700">{profileUser.streak} days</p>
          </div>
        </div>

        {/* Connected Friends Section */}
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Connected Friends</h2>
          {profileUser.connectedFriends.length > 0 ? (
            <ul className="space-y-2">
              {profileUser.connectedFriends.map((friend, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-lg text-gray-700">{friend}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-600">No friends connected yet.</p>
          )}
        </div>

        {/* Following Section (for Circle compatibility) */}
        <div className="bg-green-100 p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Following</h2>
          {profileUser.following.length > 0 ? (
            <ul className="space-y-2">
              {profileUser.following.map((followed, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-lg text-gray-700">{followed}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-600">Not following anyone yet.</p>
          )}
        </div>

        {/* Bookmarks Section (for Circle compatibility) */}
        <div className="bg-green-100 p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Bookmarks</h2>
          {profileUser.bookmarks.length > 0 ? (
            <ul className="space-y-2">
              {profileUser.bookmarks.map((bookmark, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-lg text-gray-700">Post ID: {bookmark}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-600">No bookmarks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Export ProfilePage as default and getProfileUser as a named export
export { ProfilePage as default, getProfileUser };