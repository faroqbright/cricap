 import MatchesCarousal from "@/ui/components/MatchesCarousal/MatchesCarousal";
 import { HomeAPI } from "@/api/methods/auth.js";
 import React, { Suspense, useState } from "react";
 import Banner from "@/ui/components/Banner/Banner";
 import Trends from "@/ui/components/Trends/Trends";
 import HomePageSeries from "@/ui/components/HomePageSeries/HomePageSeries";
 import HomePageMainSection from "@/ui/components/HomePageMainSection/HomePageMainSection";
 import ServerError from "@/ui/components/Error/ServerError";
 import Loading from "./loading";

 const fetchHomePage = async () => {
   const data = await HomeAPI();
   return data;
 };

 const page: React.FC = async ({ ...props }) => {
   const homePageData = await fetchHomePage();

   if (homePageData.status === 200) {
     return (
       <div className="p-2 md:p-0" {...props}>
         <Suspense>
           {/* <Banner bannerData={homePageData.data.banners || []} /> */}
         </Suspense>
         <Suspense fallback={<Loading />}>
           <MatchesCarousal matchesData={homePageData?.data?.matches} />
         </Suspense>
         <Suspense>
           <Trends tagsData={homePageData.data.tags} />
           
         </Suspense>
         <Suspense>
           <HomePageSeries seriesData={homePageData.data.series} />
         </Suspense>
         <Suspense fallback={<Loading />}>
           <HomePageMainSection />
         </Suspense>
       </div>
     );
   } else if (homePageData.status === 500) {
     return <ServerError />;
   } else {
     return <ServerError />;
   }
 };
 export default page;

// "use client";

// import React, { useEffect, useState, Suspense } from "react";
// import { io, Socket } from "socket.io-client";
// import MatchesCarousal from "@/ui/components/MatchesCarousal/MatchesCarousal";
// import { HomeAPI } from "@/api/methods/auth.js";
// import Banner from "@/ui/components/Banner/Banner";
// import Trends from "@/ui/components/Trends/Trends";
// import HomePageSeries from "@/ui/components/HomePageSeries/HomePageSeries";
// import HomePageMainSection from "@/ui/components/HomePageMainSection/HomePageMainSection";
// import ServerError from "@/ui/components/Error/ServerError";
// import Loading from "./loading";

// const SOCKET_URL = "https://backend.stage.cricap.co/";

// // Custom hook for WebSocket connection
// const useSocket = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("auth") || "{}")?.jwt;

//     if (!token) {
//       setError("Authentication token not found.");
//       return;
//     }

//     const socketInstance = io(SOCKET_URL, {
//       extraHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 10000,
//     });

//     setSocket(socketInstance);

//     socketInstance.on("connect", () => {
//       console.log("Socket connected");
//       setIsConnected(true);
//       setError(null);
//     });

//     socketInstance.on("disconnect", () => {
//       console.log("Socket disconnected");
//       setIsConnected(false);
//     });

//     socketInstance.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//       setError("Unable to connect to the server.");
//     });

//     socketInstance.on("error", (err) => {
//       console.error("Socket error:", err);
//       setError("Socket error occurred.");
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return { socket, isConnected, error };
// };

// const fetchHomePage = async () => {
//   const data = await HomeAPI();
//   return data;
// };

// const Page: React.FC = async ({ ...props }) => {
//   const { isConnected, error } = useSocket();
//   const homePageData = await fetchHomePage();

//   if (homePageData.status === 200) {
//     return (
//       <div className="p-2 md:p-0" {...props}>
//         <div className="p-4 mb-4">
//           <h1 className="text-xl font-bold">WebSocket Connection</h1>
//           {error ? (
//             <div className="text-red-500">Error: {error}</div>
//           ) : isConnected ? (
//             <div className="text-green-500">Connected to the server!</div>
//           ) : (
//             <div className="text-yellow-500">Connecting...</div>
//           )}
//         </div>
//         <Suspense>
//           <Banner bannerData={homePageData.data.banners || []} />
//         </Suspense>
//         <Suspense fallback={<Loading />}>
//           <MatchesCarousal matchesData={homePageData?.data?.matches} />
//         </Suspense>
//         <Suspense>
//           <Trends tagsData={homePageData.data.tags} />
//         </Suspense>
//         <Suspense>
//           <HomePageSeries seriesData={homePageData.data.series} />
//         </Suspense>
//         <Suspense fallback={<Loading />}>
//           <HomePageMainSection />
//         </Suspense>
//       </div>
//     );
//   } else if (homePageData.status === 500) {
//     return <ServerError />;
//   } else {
//     return <ServerError />;
//   }
// };

// export default Page;



// "use client"; 


// import React, { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "https://backend.stage.cricap.com/"; // Correct base URL without query strings

// // Custom hook for WebSocket connection
// const useSocket = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Retrieve the JWT token from localStorage
//     const token = JSON.parse(localStorage.getItem("auth") || "{}")?.jwt;
// console.log(token,);

//     if (!token) {
//       setError("Authentication token not found.");
//       return;
//     }

//     // Initialize the socket connection with Bearer token in headers
//     const socketInstance = io(SOCKET_URL, {
  
//       extraHeaders: {
//         Authorization: `Bearer ${token}`, // Add Bearer token in headers
//       },
//       reconnection: true, // Enable reconnection attempts
//       reconnectionAttempts: Infinity, // Infinite reconnection attempts
//       reconnectionDelay: 1000, // 1-second delay between reconnection attempts
//       reconnectionDelayMax: 5000, // Max 5-second delay for reconnections
//       timeout: 10000, // Timeout for the initial connection
//     });

//     setSocket(socketInstance);

//     // Listen for connection events
//     socketInstance.on("connect", () => {
//       console.log("Socket connected");
//       setIsConnected(true);
//       setError(null); // Clear error if reconnected
//     });

//     socketInstance.on("disconnect", () => {
//       console.log("Socket disconnected");
//       setIsConnected(false);
//     });

//     socketInstance.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//       setError("Unable to connect to the server.");
//     });

//     socketInstance.on("error", (err) => {
//       console.error("Socket error:", err);
//       setError("Socket error occurred.");
//     });

//     // Cleanup socket connection on component unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return { socket, isConnected, error };
// };

// const Page: React.FC = () => {
//   const { isConnected, error } = useSocket();

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">WebSocket Connection</h1>
//       {error ? (
//         <div className="text-red-500">Error: {error}</div>
//       ) : isConnected ? (
//         <div className="text-green-500">Connected to the server!</div>
//       ) : (
//         <div className="text-yellow-500">Connecting...</div>
//       )}
//     </div>
//   );
// };

// export default Page;




// "use client";

// import React, { useEffect, useState, Suspense } from "react";
// import { io, Socket } from "socket.io-client";
// import MatchesCarousal from "@/ui/components/MatchesCarousal/MatchesCarousal";
// import { HomeAPI } from "@/api/methods/auth.js";
// import Banner from "@/ui/components/Banner/Banner";
// import Trends from "@/ui/components/Trends/Trends";
// import HomePageSeries from "@/ui/components/HomePageSeries/HomePageSeries";
// import HomePageMainSection from "@/ui/components/HomePageMainSection/HomePageMainSection";
// import ServerError from "@/ui/components/Error/ServerError";
// import Loading from "./loading";

// const SOCKET_URL = "https://backend.stage.cricap.com/";

// // Custom hook for WebSocket connection
// const useSocket = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("auth") || "{}")?.jwt;

//     if (!token) {
//       setError("Authentication token not found.");
//       return;
//     }

//     const socketInstance = io(SOCKET_URL, {
//       extraHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 10000,
//     });

//     setSocket(socketInstance);

//     socketInstance.on("connect", () => {
//       console.log("Socket connected");
//       setIsConnected(true);
//       setError(null);
//     });

//     socketInstance.on("disconnect", () => {
//       console.log("Socket disconnected");
//       setIsConnected(false);
//     });

//     socketInstance.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//       setError("Unable to connect to the server.");
//     });

//     socketInstance.on("error", (err) => {
//       console.error("Socket error:", err);
//       setError("Socket error occurred.");
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return { socket, isConnected, error };
// };

// const useHomePageData = () => {
//   const [homePageData, setHomePageData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await HomeAPI();
//         setHomePageData(response);
//       } catch (err) {
//         console.error("Error fetching homepage data:", err);
//         setError("Failed to load homepage data.");
//       }
//     };

//     fetchData();
//   }, []);

//   return { homePageData, error };
// };

// const Page: React.FC = () => {
//   const { socket, isConnected, error: socketError } = useSocket();
//   const { homePageData, error: homePageError } = useHomePageData();

  
//   useEffect(() => {
//     if (socket && isConnected) {
  
//       socket.emit("fetchData", { someKey: "someValue" });


//       socket.on("dataReceived", (data) => {
//         console.log("Data received from server:", data);
//       });

//       return () => {
//         socket.off("dataReceived");
//       };
//     }
//   }, [socket, isConnected]);

//   if (homePageError || socketError) {
//     return (
//       <div className="p-4">
//         <h1 className="text-xl font-bold">Error</h1>
//         <div className="text-red-500">
//           {socketError || homePageError || "An unexpected error occurred."}
//         </div>
//       </div>
//     );
//   }

//   if (!homePageData || !homePageData.data) {
//     return <Loading />;
//   }

//   return (
//     <div className="p-2 md:p-0">
//       <div className="p-4 mb-4">
//         <h1 className="text-xl font-bold">WebSocket Connection</h1>
//         {isConnected ? (
//           <div className="text-green-500">Connected to the server!</div>
//         ) : (
//           <div className="text-yellow-500">Connecting...</div>
//         )}
//       </div>
//       <Suspense>
//         <Banner bannerData={homePageData.data.banners || []} />
//       </Suspense>
//       <Suspense fallback={<Loading />}>
//         <MatchesCarousal matchesData={homePageData?.data?.matches} />
//       </Suspense>
//       <Suspense>
//         <Trends tagsData={homePageData.data.tags} />
//       </Suspense>
//       <Suspense>
//         <HomePageSeries seriesData={homePageData.data.series} />
//       </Suspense>
//       <Suspense fallback={<Loading />}>
//         <HomePageMainSection />
//       </Suspense>
//     </div>
//   );
// };

// export default Page;
