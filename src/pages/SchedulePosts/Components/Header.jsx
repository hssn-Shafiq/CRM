import React, { Component } from "react";

const Header = () => {
  return (
    <>
      <header className="container-fluid header-custom">
        {/* Dropdown on the left side */}
        <div className="dropdown-custom">
          <button
            className="dropdown-custom-btn btn btn-dark dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-chart-simple icon-drowp-status" />
            Status
          </button>
          <ul
            className="dropdown-menu dropdown-menu-custom"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-solid fa-chart-simple icon-drowp-status" /> All
                Accounts
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-regular fa-circle-check icon-drowp-status" />{" "}
                Active Accounts
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-solid fa-arrows-rotate icon-drowp-status" />{" "}
                Reauthorization Needed
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-solid fa-lock icon-drowp-status" />
                Locked Accounts
              </a>
            </li>
          </ul>
        </div>
        <div className="dropdown-custom">
          <button
            className="dropdown-custom-btn btn btn-dark dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-user-group icon-drowp-status" />
            All Accounts
          </button>
          <ul
            className="dropdown-menu dropdown-menu-custom"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-solid fa-user-group icon-drowp-status" /> All
                Accounts
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-facebook icon-drowp-account-fb" />{" "}
                Facebook
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-instagram icon-drowp-account-instagram" />{" "}
                Instagram
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-tiktok icon-drowp-account-tiktok" />{" "}
                Tiktok
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-x-twitter icon-drowp-account-twitter" />{" "}
                Twitter
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-threads icon-drowp-account-threads" />{" "}
                Threads
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-linkedin icon-drowp-account-linkdln" />{" "}
                Linkedln
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-pinterest icon-drowp-account-pinterest" />{" "}
                pinterest
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-brands fa-square-google-plus" />
                Google
              </a>
            </li>
          </ul>
        </div>
        <div className="dropdown-custom">
          <button
            className="dropdown-custom-btn btn btn-dark dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-users icon-drowp-status" />
            By Groups
          </button>
          <ul
            className="dropdown-menu dropdown-menu-custom"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                All Accounts
              </a>
            </li>
            <li>
              <a className="dropdown-item dropdown-item-custom" href="#">
                <i className="fa-solid fa-gear" /> Manage Groups
              </a>
            </li>
          </ul>
        </div>
        {/* Search box on the right side */}
        <div className="search-box-custom">
          <i className="fa-solid fa-magnifying-glass searchbar-icon-custom" />
          <input
            type="text"
            className="form-control-custom"
            placeholder="Search..."
          />
        </div>
      </header>
    </>
  );
};

export default Header;
