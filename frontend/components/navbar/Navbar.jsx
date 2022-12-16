import React from "react";
import TheonLogo from "../../public/assets/theonrex plain.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Theme from "../Theme";
import { useAccount, useBalance } from "wagmi";

const Navbar = () => {
  const AccountBalance = () => {
    const { address } = useAccount();
    const { data, refetch } = useBalance({
      address,
      watch: true,
    });
    return (
      <div className=" container-xxl">
        {data?.formatted === 0 ? (
          <a href="https://mumbaifaucet.com/" target="_blank" rel="noreferrer">
            {" "}
            Get free testnet polygon{" "}
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAACtUlEQVRYhe3YPYgVZxTG8TPLyiJr0CgkaKOoRRK2NEogSWcjWiiKBMEmRCEfWGolKcSkUQmkkcQPbEQRlAXBwLZqyIekCBiCxSIkBhJJWBTF/fhZzGx4d3zveG9y727hfarLnfOc85/3zJx3ZiL66quv7ggD2INT2LHQPHOEN3HDXH2LTQsNtgrnMCOv6er4q/MNthgHMdECrK4H+BRD8wG3C+MZiHv4AGvxEf7MxPyKrb2E258p+hif46Va7DKcwJOMZ3evAC/XCl3Fuud4XsNYzXemV4CjSZEbGGjTN4ifEu+5bjE1AXxXFMVMO0mKopiKiO+7gzRXTYA6zDUbPxERl+YcYKVywP+B81jTYe5/E6UtPtGh9zC+ksxEDOGQZ8fVIxzB8LwBZnJtw53MHZ7qN+xrutbbugk6BBvBWESMRkQ6AaYj4nZETCX/rYqIkxFxHRvbSZ6u4IUOwVbgS0xmVuoK1ldxq3EhEzODs41trwFO4cOm5a88g/gE9zNFf8bmFr53cSvjOdZU7FjG8CPeaRG/uYKo634FPfickxvAx9VizGq0yTBcLXP96WVG2ZbVVdx6ZdvqmlS2eUUTWKZu2vLWgIlhI262ALhdO+NZjWGkE7Ck3vGOACtTofWTTaq72PtfwP4XYGIeVg7VRzWwCeUQHkpiX8FJHJ03wCTJGuU2dU+5ba2sHd+Kf6oip7sF2HiXpSqKYjwi3msI2RERS2fDOwFsiu/6TlJpAxa1E6icsy1fvroJOJ38HomIb/BGk0H5MDwaEW+1yNM9Yadn5+ckvsDLtdgl+Ez5OlHXvp4AVoW34JdM0b+UO8s6vI/fMzHj2NUzuARyEQ7g7wxETg+VL2VLeg5XA11etTe361BeDhdV2+eCCa/jWg3uB7y9oGB1YTu+Vn6A6tV466uvF09PAYl4Qi/9sg+nAAAAAElFTkSuQmCC"
              alt="polygon logo"
            />
          </a>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid  container-xxl connect_navbar">
          <ul className="navbar-nav nav_connect_btn">
            <li className="nav-item ">
              <div className="">
                <ConnectButton
                  accountStatus={{
                    smallScreen: "full",
                    largeScreen: "full",
                  }}
                />
              </div>
            </li>
            <li className="nav-item">
              <div >
                <Theme />
              </div>
            </li>
            {/* <button className="buy-btn hide">
                <a href="/#"> Buy Now</a>
              </button> */}
          </ul>

          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          ></div>
          <div
            className="collapse navbar-collapse  justify-content-end"
            id="navbarNav "
          >
            <ul className="navbar-nav ">
              {/* <li className="nav-item">
                <a className="nav-link " href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-cart3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid container-xxl">
          <a className="navbar-brand" href="/#">
            <img src={TheonLogo.src} alt="logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav ">
              <li className="nav-item">
                <a className="nav-link " href="/">
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/my-items">
                  Dashboard
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link " href="/marketplace">
                  Marketplace
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link purchase_btn" href="/createnft">
                  Create <i className="bi bi-cloud-plus-fill"></i>
                </a>
              </li>
            </ul>
          </div>
          <div
            className="collapse navbar-collapse  justify-content-end"
            id="navbarNav "
          >
            <ul className="navbar-nav ">
              {/* <li className="nav-item">
                <a className="nav-link " href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-cart3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>

      <nav className="AccountBalance_nav">
        <AccountBalance />
      </nav>
    </>
  );
};

export default Navbar;
