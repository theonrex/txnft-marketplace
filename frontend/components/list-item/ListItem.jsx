import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";

import {
  NFT_MARKETPLACE_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  NFT_MARKETPLACE_ABI,
  NFT_CONTRACT_ABI,
} from "../../constants/index";
import { useAccount, useConnect, useSigner } from "wagmi";
import Image from "next/image";



const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_PROJECT_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;
const client = create({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      "base64"
    )}`,
  },
});

export default function ListItem() {
  const router = useRouter();
  const [isListing, setisListing] = useState(false);
  const [file, setFile] = useState();
  const [formData, setFormData] = useState({
    price: "",
    name: "",
    description: "",
  });

  //wagmi signer
  const { data: signer } = useSigner();
  const { connector: activeConnector, isConnected } = useAccount();

  // Onchange of image file
  const onChange = async (e) => {
    const fileData = e.target.files[0];
    try {
      const add = await client.add(fileData, {
        progress: (prog) => console.log("Image is uploaded : ", prog),
      });
      const url = `https://theonnfts.infura-ipfs.io/ipfs/${add.path}`;
      setFile(url);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const connectWallet = () => {
    if (typeof window !== "undefined") {
      alert("connect wallet");
    }
  };

  // Access-Control-Allow-Origin: http://localhost:3000
  // Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  // Access-Control-Allow-Headers: Content-Type, Authorization

  // Main function to list an item. First it mint an NFT and then List an nft.
  const createItem = async (url) => {
    setisListing(true);

    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      signer
    );

    let transaction = await nftContract.mintToken(url);
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    let convertedPrice = ethers.utils.parseUnits(formData.price, "ether");
    const nftMarketPlaceContract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      signer
    );

    let listingPrice = await nftMarketPlaceContract.getListingPrice();
    listingPrice = await listingPrice.toString();
    let listingTx = await nftMarketPlaceContract.listItem(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      convertedPrice,
      { value: listingPrice }
    );
    await listingTx.wait();

    router.push("/marketplace");
    setisListing(false);
  };

  const listAnItem = async () => {
    setisListing(true);
    const { name, price, description } = formData;
    if (!name || !price || !description || !file) {
      console.log("Some feild are missing");
      setisListing(false);
      return;
    }

    const data = JSON.stringify({ name, description, image: file });
    try {
      const added = await client.add(data);
      const url = `https://theonnfts.infura-ipfs.io/ipfs/${added.path}`;
      createItem(url);
    } catch (error) {
      console.log("Error in listAnItem function ", error);
    }
  };

  return (
    <div className="flex justify-center  container create_item rowx">
      <section className="create_form col50">
        <form action="">
          <input
            id="name"
            placeholder="e.g.Monkey"
            label="Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </form>
        <input
          id="description"
          placeholder="e.g.This is most unique monkey in the world."
          label="Description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          id="price"
          placeholder="e.g.10 (In Polygon)"
          label="Price"
          onChange={(e) => {
            console.log(formData.price);
            setFormData({ ...formData, price: e.target.value });
            console.log(formData);
          }}
        />

        <input
          id="file"
          accept=".jpg,.png"
          placeholder="Choose image file"
          label="3 Image"
          type="file"
          onChange={onChange}
        />

        {!isConnected ? (
          <button
            text="List NFT"
            className="btn_submit_nft"
            onClick={connectWallet}
            disabled={isListing}
          >
            Connect Wallet
          </button>
        ) : (
          <button
            text="List NFT"
            className="btn_submit_nft"
            onClick={listAnItem}
            disabled={isListing}
          >
            create nft
          </button>
        )}
      </section>
      <section className="col50 nft_uploaded_image">
        {file ? <img src={file} alt="Choosen image" /> : null}
      </section>{" "}
    </div>
  );
}
