import React from "react";
import SellerItems from "../../components/seller-items/SellerItems";
import MainLayout from "../../components/layouts/MainLayout";


export default function mylisteditems() {
  return (
    <MainLayout>
      <div className="container">
        <header>Your Listed NFTs</header>
      </div>
      <SellerItems />
    </MainLayout>
  );
}
