"use client";

import { useState } from "react";
import CollectionTab from "./collection-tab/CollectionTab";
import styles from "./collections.module.scss";

export default function Collections() {
  const [activeTab, setActiveTab] = useState(0);

  const tabsData = [
    { id: 1, content: "My Links 🔗" },
    { id: 2, content: "My Art 🏆" },
  ];
  return (
    <div className={styles.tabs}>
      {tabsData.map((tab, index) => (
        <CollectionTab
          key={tab.id}
          content={tab.content}
          isActive={activeTab === index}
          setIsActive={() => {
            setActiveTab(index);
          }}
        />
      ))}
    </div>
  );
}
