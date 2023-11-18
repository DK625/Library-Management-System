import React, { useContext, useEffect, useState } from "react";
import "../AdminDashboard/AdminDashboard.css";
import "./MemberDashboard.css";

import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BookIcon from "@material-ui/icons/Book";
import HistoryIcon from "@material-ui/icons/History";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import CloseIcon from "@material-ui/icons/Close";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { IconButton } from "@material-ui/core";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import moment from "moment";

import ReceiptIcon from '@material-ui/icons/Receipt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import GetMember from '../AdminDashboard/Components/GetMember';
import Profile from '../AdminDashboard/Components/Profile';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import Return from '../AdminDashboard/Components/Return';

import MemberTransaction from '../AdminDashboard/Components/MemberTransaction'
import AddMember from '../AdminDashboard/Components/AddMember'
import AddBook from '../AdminDashboard/Components/AddBook';
import Book from '../AdminDashboard/Components/Book';



function MemberDashboard() {
  const [active, setActive] = useState("profile");
  const [sidebar, setSidebar] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);
  const [memberDetails, setMemberDetails] = useState(null);

  useEffect(() => {
    const getMemberDetails = async () => {
      try {
        const response = await axios.get(
          API_URL + "api/users/getuser/" + user._id
        );
        setMemberDetails(response.data);
      } catch (err) {
        console.log("Error in fetching the member details");
      }
    };
    getMemberDetails();
  }, [API_URL, user]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <div className="sidebar-toggler" onClick={() => setSidebar(!sidebar)}>
          <IconButton>
            {sidebar ? <CloseIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} /> : <DoubleArrowIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />}
          </IconButton>
        </div>

        {/* Sidebar */}
        <div className={sidebar ? "dashboard-options active" : "dashboard-options"}>
          <div className='dashboard-logo'>
            <LibraryBooksIcon style={{ fontSize: 50 }} />
            <p className="logo-name">Member Page</p>
          </div>
          <p className={`dashboard-option ${active === "profile" ? "clicked" : ""}`} onClick={() => { setActive("profile"); setSidebar(false) }}><AccountCircleIcon className='dashboard-option-icon' /> Profile</p>
          <p className={`dashboard-option ${active === "addbook" ? "clicked" : ""}`} onClick={() => { setActive("addbook"); setSidebar(false) }}><BookIcon className='dashboard-option-icon' />Books</p>
          <p className={`dashboard-option ${active === "addtransaction" ? "clicked" : ""}`} onClick={() => { setActive("addtransaction"); setSidebar(false) }}><ReceiptIcon className='dashboard-option-icon' /> Add Transaction </p>
          <p className={`dashboard-option`} onClick={logout}><PowerSettingsNewIcon className='dashboard-option-icon' /> Log out </p>

        </div>
        <div className="dashboard-option-content">
          <div className="dashboard-addbooks-content" style={active !== "profile" ? { display: 'none' } : {}}>
            <Profile />
          </div>
          <div className="dashboard-addbooks-content" style={active !== "addbook" ? { display: 'none' } : {}}>
            <Book />
          </div>
          <div className="dashboard-transactions-content" style={active !== "addtransaction" ? { display: 'none' } : {}}>
            <MemberTransaction />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberDashboard;
