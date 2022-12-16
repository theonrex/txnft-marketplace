import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { nftAddress, nftMarketplaceAddress } from "../../../config/networkAddress";
import NFTAbi from "../../../abi/NFT.json";
import NFTMarketplaceAbi from "../../../abi/NFTMarketplace.json";
import axios from "axios";
import { useSigner } from "wagmi";
import { useRouter } from "next/router";
import NftInfo from "../../../components/nft-info/NftInfo";

export default function ListedNFTItemId() {
  const router = useRouter();
  let { itemid } = router.query;

  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState();
  const [isPurchasing, setisPurchasing] = useState(false);

  const loadNFT = async () => {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da");
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
  };

  // const buyNFT = async (price, tokenId) => {
  //   //wagmi signer
  //   const { data: signer, isError, isLoading } = useSigner();

  //   const nftMarketPlaceContract = new ethers.Contract(
  //     nftMarketplaceAddress,
  //     NFTMarketplaceAbi.abi,
  //     signer
  //   );

  //   let convertedPrice = ethers.utils.parseUnits(price.toString(), "ether");

  //   const transaction = await nftMarketPlaceContract.buyItem(
  //     nftAddress,
  //     tokenId,
  //     {
  //       value: convertedPrice,
  //     }
  //   );
  //   await transaction.wait();
  //   await router.push("/my-items");
  // };

  useEffect(() => {
    const load = async () => {
      if (router.query.itemid) await loadNFT();
    };
    load();
  }, [itemid]);

  return (
    <div>
      <NftInfo nftData={nftData}>
        {/* <BtnMain
          text="Re Sell"
          icon={<AiOutlineArrowRight className="text-2xl" />}
          className="w-full"
          onClick={() => buyNFT(nftData.price.toString(), nftData.tokenId)}
        /> */}
      </NftInfo>
    </div>
  );
}
