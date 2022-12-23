import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useSigner, useAccount, useBalance } from "wagmi";
import { useRouter } from "next/router";
import { AiOutlineArrowRight } from "react-icons/ai";
import NftInfo from "../../components/nft-info/NftInfo";
import Loading from "../../components/Loading";
import {
  NFT_MARKETPLACE_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  NFT_MARKETPLACE_ABI,
  NFT_CONTRACT_ABI,
} from "../../constants/index";

export default function Itemid() {
  const router = useRouter();
  let { itemid } = router.query;

  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState();
  const [isPurchasing, setIsPurchasing] = useState(false);

  //wagmi signer
  const { data: signer, isError, isLoading } = useSigner();
  const loadNFT = async () => {
    setLoading(true);
    setIsPurchasing(true);
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da"
    );
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      provider
    );
    const nftMarketPlaceContract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      provider
    );
    const data = await nftMarketPlaceContract.getPerticularItem(
      router.query.itemid
    );

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
        image: metaData?.data?.image,
        name: metaData.data?.name,
        description: metaData.data.description,
      };
      // console.log(item);
      setNftData(item);
    };
    allData();
    setLoading(false);
    setIsPurchasing(false);
  };

  const buyNFT = async (price, tokenId) => {
    setIsPurchasing(true);

    const nftMarketPlaceContract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      signer
    );

    let convertedPrice = ethers.utils.parseUnits(price.toString(), "ether");

    const transaction = await nftMarketPlaceContract.buyItem(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      {
        value: convertedPrice,
      }
    );

    await transaction.wait();
    await router.push("/my-items");
    setIsPurchasing(false);
  };

  useEffect(() => {
    const load = async () => {
      if (router.query.itemid) await loadNFT();
    };
    load();
  }, [itemid]);
  //check account balance

  const { address } = useAccount();

  const { data, refetch } = useBalance({
    address,
    watch: true,
  });

    async function buyNFTs(nft) {
    

      //sign the transaction
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFT_MARKETPLACE_ADDRESS,
          NFT_MARKETPLACE_ABI,
        signer
      );

      //set the price
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      //make the sale
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.tokenId,
        {
          value: price,
        }
      );
      await transaction.wait();

      loadNFTs();
    }

  return (
    <div>
   
      {!nftData && loading ? (
        <Loading />
      ) : (
        <NftInfo nftData={nftData}>
          {data < nftData?.price ? (
            "insufficient amount for this transaction"
          ) : (
            <button
              text="Buy Now"
              icon={<AiOutlineArrowRight className="text-2xl" />}
              className="nft_id_buy_btn"
              onClick={() => buyNFT(nftData.price.toString(), nftData.tokenId)}
              disabled={isPurchasing}
            >
              Buy Item
            </button>
          )}
        </NftInfo>
      )}
    </div>
  );
}
