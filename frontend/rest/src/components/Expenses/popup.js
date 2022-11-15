import React from "react";
import './popup.css';
 
const Popup = props => {
  return (
    <div className="popup-box">
      <div className="box">
        {/* <span className="close-icon" onClick={props.handleClose}>x</span> */}
        {props.content}
      </div>
    </div>
  );
};
 
export default Popup;

// useEffect(()=>{
//     const getData = async () => {
//       const url = `http://localhost:8080/feed/posts?page=${controller.page}&size=${controller.rowsPerPage}`;
//       try {
//         const response = await fetch(url,{headers:{Authorization: "Bearer " + props.token,}});
//         if (response.statusText === "OK") {
//           const data = await response.json();
//           console.log(data);
//           setPost(data.posts);
//           console.log(posts);
//           setPassengersCount(data.totalItems);
//         } else {
//           throw new Error("Request failed");
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getData();
//   }, [controller]);

//   const handlePageChange = (event, newPage) => {
//     setController({
//       ...controller,
//       page: newPage,
//     });
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setController({
//       ...controller,
//       rowsPerPage: parseInt(event.target.value, 10),
//       page: 0,
//     });
//   };
