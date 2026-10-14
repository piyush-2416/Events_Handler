import React from "react";
  
 function App() {
  return (
    <div>
      <div className="drawer">
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-1"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="bg-base-200 p-4 w-80 min-h-full menu">
            {/* Sidebar content here */}
            <li>
                 <h2 style={{ color: "gray" }}>Community</h2>       
            </li>
            <li>
               
                <b>
                  <h3>🏠 Dashboard</h3>
                </b>
                     
            </li>
            <li>
              
                <b>
                  <h3>👥 About</h3>
                </b>
                     
            </li>
            <li>
                  
                <b>
                  <h3>🤝 Volunteers</h3>
                </b>
                     
            </li>{" "}
            <li>
                 
                <b>
                  <h3>🗳️ Polls & Voting</h3>
                </b>
                     
            </li>
            <li>
              <h2 style={{ color: "gray" }}>Discover </h2>
            </li>{" "}
            <li>
              
                <b>
                  <h3>🔍 Explore</h3>
                </b>
                     
            </li>
            <li>
              
                <b>
                  <h3>📰 Community Feed</h3>
                </b>
                     
            </li>
            <li>
               
                <b>
                  <h3>📸 Memories</h3>
                </b>
                     
            </li>
            {/* <li>
                   Gallery">
                <b>
                  <h3></h3>
                </b>
                     
            </li>{" "} */}
            <li>
                     <b>
                  <h3>🏆 Achievements</h3>
                </b>
                     
            </li>
             <li>
             
                <b>
                  <h3>💬 Feedback</h3>
                </b>
                     
            </li>
            <li>
              
              <h2 style={{ color: "gray" }}>Account</h2>
            </li>
            <li>
              <b>
                <a>👤My Profile </a>
              </b>
            </li>{" "}
            
            <li>
              <b>
                <a> 💾 Saved</a>
              </b>
            </li>   
              <li>
                  
                <b>
                  <h3>⚙️Settings</h3>
                </b>
                     
            </li>
            <li>
              <b>
                <a>Logout</a>
              </b>
            </li>
            <img src="" />
          </ul>
        </div>
      </div>
      <div
        className="bg-base-100 shadow-sm navbar"
        style={{ backgroundColor: "mediumseagreen" }}
      >
      <div className="navbar-start">
  <div className="dropdown">
    <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content">
      <label htmlFor="my-drawer-1" className="inline-block cursor-pointer">
        <img
          src="/MyCommunity%20Logo.png"
          alt="MyCommunity Logo"
          className="bg-white shadow-md p-1 border-4 border-white rounded-full w-10 md:w-20 h-7 md:h-16 object-contain transition-transform duration-200"
        />
      </label>
    </div>
  </div>
</div>
        <div className="navbar-center">
          {/* <a className="text-xl btn btn-ghost"> </a> */}
        </div>
        <div className="navbar-end">  

          <button className="btn btn-ghost btn-circle">
           👤
          </button>

          
        </div>
      </div>
    </div>
  );
}

export default App;