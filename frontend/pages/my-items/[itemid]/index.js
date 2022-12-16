import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "../../../config/networkAddress";
import NFTAbi from "../../../abi/NFT.json";
import NFTMarketplaceAbi from "../../../abi/NFTMarketplace.json";
import axios from "axios";
import { useRouter } from "next/router";
import { AiOutlineArrowRight } from "react-icons/ai";
import NftInfo from "../../../components/nft-info/NftInfo";
import { useSigner } from "wagmi";

export default function Itemid() {
  const router = useRouter();
  let { itemid } = router.query;

  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState();
  const [resellPrice, setResellPrice] = useState("");
  const [isReselling, setIsReselling] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  //wagmi signer
  const { data: signer, isError, isLoading } = useSigner();
  const loadNFT = async () => {
    setLoading(true);
    setIsPurchasing(true);
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da"
    );
    const nftContract = new ethers.Contract(nftAddress, NFTAbi.abi, provider);
    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi.abi,
      provider
    );
    const data = await nftMarketPlaceContract.getPerticularItem(
      router.query.itemid
    );
    console.log(data);

    const allData = async () => {
      let convertedPrice = ethers.utils.formatUnits(
        data.price.toString(),
        "ether"
      );
      const tokenUri = await nftContract.tokenURI(data.tokenId);
      const metaData = await axios.get(tokenUri);
      let item = {
        price: convertedPrice,
        tokenId: data.tokenId.toNumber(),
        seller: data.seller,
        owner: data.owner,
        image: metaData.data.image,
        name: metaData.data.name,
        description: metaData.data.description,
      };
      console.log(item);
      setNftData(item);
    };
    allData();
    setLoading(false);
    setIsPurchasing(false);
  };

  const buyNFT = async (price, tokenId) => {
    setIsPurchasing(true);

    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi.abi,
      signer
    );

    let convertedPrice = ethers.utils.parseUnits(price.toString(), "ether");

    const transaction = await nftMarketPlaceContract.buyItem(
      nftAddress,
      tokenId,
      {
        value: convertedPrice,
      }
    );

    await transaction.wait();
    await router.push("/my-items");
    setIsPurchasing(false);
  };
  const [formInput, updateFormInput] = useState({ price: "", image: "" });

  const resellNFT = async (price, tokenId) => {
    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi.abi,
      signer
    );

    let convertedPrice = ethers.utils.parseUnits(price, "ether");

    let listingPrice = await nftMarketPlaceContract.getListingPrice();
    listingPrice = await listingPrice.toString();
    // tokenId.toNumber();

    const transaction = await nftMarketPlaceContract.resellItem(
      nftAddress,
      tokenId,
      convertedPrice,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
    await router.push("/my-listed-items");
  };
  useEffect(() => {
    const load = async () => {
      if (router.query.itemid) await loadNFT();
    };
    load();
  }, [itemid]);

  return (
    <div>
      <NftInfo nftData={nftData}>
        <button
          icon={<AiOutlineArrowRight className="text-2xl" />}
          className="bg-blue-500"
          onClick={() => setIsReselling(!isReselling)}
        >
          {isReselling ? "Cancel" : "ReSell NFT"}
        </button>
        {isReselling && (
          <div>
            <input
              id="resellprice"
              placeholder="e.g.10 (In Ether)"
              label="Resell Price"
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
            />
            <button
              text="Buy Now"
              icon={<AiOutlineArrowRight className="text-2xl" />}
              className="nft_id_buy_btn"
              onClick={() =>
                resellNFT(nftData.price.toString(), nftData.tokenId)
              }
              disabled={isPurchasing}
            >
              But Item
            </button>
          </div>
        )}
      </NftInfo>
    </div>
  );
}
