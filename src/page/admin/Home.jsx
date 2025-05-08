// import  { useEffect, useState } from "react";
// import axiosInstance from "../../component/axiosInstance";

// const Home = () => {
//   const [userData, setUserData] = useState([]);
//   const [homeData, setHomeData] = useState({});
//   const [barChartData, setBarChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedData, setSelectData] = useState({})
//   const token = localStorage.getItem("authToken")

//   const handleReject = () => {
//     alert("User Rejected");
//     setModalVisible(false);
//   };

//   useEffect(() => {

//     const fetchBarChartData = async () => {
//       try {
//         const response = await axiosInstance.get("/mainapp/calculate_yearly_revenue/",{
//           headers:{
//             Authorization : `Bearer ${token}`
//           }
//         });
//         setBarChartData(response.data.monthly_revenue);
//         setHomeData(response.data)
//         console.log("bar chart", response.data);
//       } catch (error) {
//         console.error("Error fetching subscriptions data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//     fetchBarChartData();
//   }, []);

//   const fetchUser = async () => {
//     try {

//       const response = await axiosInstance.get("/auth/all-users/");

//       if (response.status === 200) {
//         console.log("✅ Chat List Fetched 33:", response.data);
//         setUserData(response.data?.guides);

//       } else {
//         console.error("❌ Error fetching chat list:", response.data.error);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching chat list:", error.message);
//     }
//   };

//   const handleApprove = async () => {

//     try {

//       const response = await axiosInstance.put(`/auth/aprove_guide/${selectedData.id}/`,{});

//       if (response.status === 200) {
//         alert("User Approved Successfully")
//        setSelectData({})
//        setModalVisible(false)
//        fetchUser()
//       } else {
//         console.error("❌ Error fetching chat list:", response.data.error);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching chat list:", error.message);
//     }
//   };

//   return (
//     <Sidebar>
//       <div className="p-6 min-h-screen">
//         <Dashboard data={homeData} barChartData={barChartData} />
//         <div className="bg-white p-4 rounded-lg shadow-md border  overflow-x-auto ">
//           <h2 className="text-lg font-bold mb-4">Guide Application</h2>
//           {loading ? (
//             <div className="text-center p-4 text-gray-500">Loading data...</div>
//           ) : (
//             <div className="h-[40vh] overflow-y-auto">

//             <table className="w-full border-collapse border rounded-sm text-left ">
//               <thead>
//                 <tr>
//               <th className="p-2">Users Name</th>

//               <th className="p-2">Phone Number</th>
//               <th className="p-2">Email</th>
//               <th className="p-2">Address</th>
//               <th className="p-2">Status</th>
//               <th className="p-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {userData.length > 0 ? (
//                   userData.map((user, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-gray-50 transition duration-200 ease-in-out"
//                     >

//                             <td className="p-2">{user.name}</td>

//                             <td className="p-2">{user.phone_number}</td>
//                             <td className="p-2">{user.user.email}</td>
//                             <td className="p-2">{user.address}</td>
//                             <td className="p-2">
//                               <span
//                                 className={`px-2 py-1 rounded-md text-sm ${
//                                   user.is_verified
//                                     ? "bg-green-100 text-green-600"
//                                     : "bg-red-100 text-red-600"
//                                 }`}
//                               >
//                                 {!user.is_verified ? "Pending":"Approved" }
//                               </span>
//                             </td>
//                             <td onClick={() =>
//                             {setModalVisible(true)
//                                setSelectData(user)}}
//                                className="p-2 cursor-pointer ">...</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center p-4 text-gray-500">
//                       No user data available.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             </div>
//           )}
//         </div>
//         <PendingProfileModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onReject={handleReject}
//         onApprove={handleApprove}
//         data={selectedData}
//       />
//       </div>
//     </Sidebar>
//   );
// };

// export default Home;
