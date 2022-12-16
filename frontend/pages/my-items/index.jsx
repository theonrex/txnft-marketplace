import React from 'react'
import MainLayout from '../../components/layouts/MainLayout';
import MyItems from '../../components/my-items/MyItems';


export default function MyItemsPage() {
  return (
    <MainLayout>
      <div className="container rowx my_items">
        <header>Your Purchased NFTs</header>
        <MyItems />
      </div>
    </MainLayout>
  );
}
