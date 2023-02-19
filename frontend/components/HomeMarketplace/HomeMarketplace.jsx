import React from "react";
import { useEffect, useState } from "react";
import { Contract, providers, utils } from "ethers";
import axios from "axios";
import NFTAbi from "../../abi/NFT.json";
import {
  NFT_MARKETPLACE_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  NFT_MARKETPLACE_ABI,
  NFT_CONTRACT_ABI,
} from "../../constants/index";
import { useAccount, useConnect, useSigner } from "wagmi";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/router";
import PolygonImg from "../../public/assets/polygon.png";

function HomeMarketplace() {
  const [nfts, setNfts] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  //wagmi signer
  const { data: signer, isError, isLoading } = useSigner();

  const { connector: activeConnector, isConnected } = useAccount();

  const connectWallet = () => {
    if (typeof window !== "undefined") {
      alert("connect wallet");
    }
  };

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_INFURA
    );

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      provider
    );

    const contract = new Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      provider
    );
    const data = await contract.getAllListedItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  const homePageNft = nfts?.slice(0, 3);

  if (homePageNft != undefined) {
    // console.log(homePageNft);
  }
  // console.log(nfts?.slice(0, 4));

  //    const first7Articles = articles?.slice(0, 7);

  const buyNFT = async (price, tokenId) => {
    setIsPurchasing(true);

    const nftMarketPlaceContract = new Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      signer
    );

    let convertedPrice = utils.parseUnits(price.toString(), "ether");

    const transaction = await nftMarketPlaceContract.buyItem(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      {
        value: convertedPrice,
      }
    );
    loadNFTs();
    await transaction.wait();
    await router.push("/my-items");
    setIsPurchasing(false);
  };

  //link [id]
  const homeNft = nfts[2];

  const ROUTE_POST_ID = "posts/[id]";
  const posts = [
    {
      id: homeNft?.name,
      title: homeNft?.tokenId,
    },
  ];
  const router = useRouter();

  return (
    <>
      <div
        className="third-section container"
        id="Marketplace"
        data-aos="flip-left"
      >
        <h1>
          {" "}
          Welcome to the nft <br />
          Marketplace
        </h1>
        <p>
          Welcome to the virtual world&apos;s one-stop-shop for the very best
          digital assets. Here you can <br />
          search and buy creators&apos;s ASSETS with SAND to incorporate them
          into your LAND.
        </p>

        <div className="rowX nft-mg">
          {homePageNft.map((homeNft, _index) => (
            <div
              className="col29 nft-img gradient-box"
              // key={`post-${homeNft.id}`}
              key={_index}
              onClick={() => {
                // buyNFT(nft);
                // router.push(`/${homeNft.tokenId}`);
              }}
            >
              <div className=" gradient-box epic-img nft_home_img_width">
                <img src={homeNft.image} alt="img" />
              </div>

              <br />
              <h3>
                <span>#{homeNft.tokenId} </span> {homeNft.name}
              </h3>

              <div className="epic-box">
                <div className="epic">
                  {!isConnected ? (
                    <button
                      text="List NFT"
                      className="epic-btn"
                      onClick={connectWallet}
                    >
                      connect
                    </button>
                  ) : (
                    <button
                      className="epic-btn"
                      onClick={() =>
                        buyNFT(homeNft?.price.toString(), homeNft.tokenId)
                      }
                    >
                      {" "}
                      Buy Now
                    </button>
                  )}

                  <img src={homeNft.image} alt="img" />
                </div>
                <div>
                  <p className="rating"> </p>{" "}
                </div>
              </div>

              <div className="eth-sale">
                <div>
                  <img alt="svgImg" src={PolygonImg.src} /> {homeNft.price}{" "}
                  MATIC
                </div>
                <div className="eth-sale-icon">
                  <a className="nav-link-svg " href="#">
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
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="button-63 ">
          <a href="/marketplace">View More</a>
        </button>
      </div>
    </>
  );
}

export default HomeMarketplace;
