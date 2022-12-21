import React from "react";
import MainLayout from "../components/layouts/MainLayout";
import Homebanner from "../components/Homebanner";
import { useEvmNativeBalance } from "@moralisweb3/next";

import { FavouriteNFTs } from "../components/FavouriteNFTs/FavouriteNFTs";
import HomeMarketplace from "../components/HomeMarketplace/HomeMarketplace";
import About from "../components/About";
import Articles from "../components/Articles";
export default function Home() {
   
  return (
    <MainLayout>
      <Homebanner />

      <FavouriteNFTs />
      <HomeMarketplace />
      <About />
      <Articles />
    </MainLayout>
  );
}
