import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import {
  NFT_MARKETPLACE_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  NFT_MARKETPLACE_ABI,
  NFT_CONTRACT_ABI,
} from "../../constants/index";
import { nftAddress, nftMarketplaceAddress } from "../../config/networkAddress";
import NFTAbi from "../../abi/NFT.json";
import NFTMarketplaceAbi from "../../abi/NFTMarketplace.json";
import { Contract, providers, utils } from "ethers";
import axios from "axios";

export default function NftInfo({ nftData, children }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new providers.JsonRpcProvider(
      "https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da"
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
        // const tokenUri = await nftContract.tokenURI(i.tokenId);
        // const meta = await axios.get(tokenUri);
        let price = utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          // image: meta.data.image,
          // name: meta.data.name,
          // description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    console.log(items);

    setLoadingState("loaded");
  }

  //import polygon current pricr from coingecko

  const [usdPrice, setUsdPrice] = useState(null);

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    };

    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setUsdPrice(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    // console.log(usdPrice.matic-network.usd)
  }, []);
  const favNfts = nfts;

  if (favNfts != undefined) {
    const UsdPrice = usdPrice
      ? ["matic-network"].usd * nfts.price
      : console.log(favNfts);
  }
  return (
    <MainLayout>
      {!nftData ? (
        <hr />
      ) : (
        <div className="rowx container nft_info_id">
          <header>
            Nft <span>Details</span>
          </header>
          <div className="col50 nftinfoId">
            <img className=" py-5 mx-auto" src={nftData?.image} />
          </div>
          <div className="col50 nft_details_ID">
            <div className="nft_details_ID">
              <h1 className="text-6xl font-bold text-blue-500">
                {nftData?.name}
              </h1>
              <h5>
                <span className="Owned_by">
                  Owned by <br />{" "}
                </span>{" "}
                {nftData.owner == "0x0000000000000000000000000000000000000000"
                  ? nftData.seller.toString()
                  : nftData.owner.toString()}
              </h5>
              <p className="text-gray-600">{nftData?.description}</p>
              <div className="current_price_id">
                <div className="nft_tag">
                  <img src="https://img.icons8.com/3d-fluency/94/null/price-tag-usd.png" />{" "}
                  | Price may be updated by the owner
                </div>
                <hr />
                <p className="">Current price</p>{" "}
                <p className="nft_info_price_id">
                  <>{nftData?.price.toString()}</> Matic{" "}
                  <span>
                    {" "}
                    ${" "}
                    {usdPrice && nftData
                      ? Number(usdPrice["matic-network"].usd).toFixed(2) *
                        Number(nftData.price).toFixed(2)
                      : null}{" "}
                    USD{" "}
                  </span>
                </p>
              </div>
            </div>

            <div>{children}</div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
