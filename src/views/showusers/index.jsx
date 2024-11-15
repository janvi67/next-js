"use client";
import { fetchUsers } from "@/api/userprofile";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import styles from "./showusers.module.css";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const[limit,setLimit]=useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeFilter,setActiveFilter]=useState();
  const token = localStorage.getItem("token");

  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);


  const fetchUserData = useCallback(async () => {
    if (token) {
      const params = {
        search: searchQuery,
        sortField: sortField,
       sortOrder:sortOrder,
       gender:genderFilter,
        page,
        limit,
        activeFilter
      };

      try {
        const res = await fetchUsers(token, params);
        const data = res.data;
        console.log("🚀 ~ fetchUserData ~ data:", data)
  
        setUsers(data.users);
        setNumberOfPages(data.totalPages
        );
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load users.");
        setLoading(false);
      }
    } else {
      toast.error("No token found, please login first.");
      setLoading(false);
    }
  }, [token, page, searchQuery, sortField,sortOrder,genderFilter,activeFilter,limit]);
    

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className={styles.userscontainer}>
      <h2>All Users</h2>

      {/* Filter, Search, and Sorting Controls */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="createdAt">Sort by Created Date</option>
          <option value="username">Sort by Username</option>
          <option value="email">Sort by Email</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <select
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">limits</option>
          <option>1</option>
          <option >2</option>
          <option >3</option>
          <option >4</option>
        </select>

        <label className={styles.activeFilter}>
          <input
            type="checkbox"
            checked={activeFilter}
            onChange={(e) => setActiveFilter(e.target.checked)}
          />
          Show Active Users Only
        </label>
      </div>
     <div>
     
     </div>
   

     
      <div className={styles.usercards}>
        {users.map((user) => (
          <div key={user._id} className={styles.usercard}>
            <img src={user.profilepic} alt="Profile" className={styles.profilepic} />
            <h3>{user.username}</h3>
            <p>Email: {user.email}</p>
            <p>
              Date of Birth:{" "}
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(user.dob))}
            </p>
            <p>Gender: {user.gender}</p>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        {pages.map((pageIndex) => (
        <button key={pageIndex} onClick={() => setPage(pageIndex)}>
          {pageIndex + 1}
        </button>
      ))}
        <button disabled={page === numberOfPages - 1} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
