import {
  ActiveTabData,
  CollectionTab,
} from "@/components/tabs-display/types/collectionTab";

export interface TabsProps {
  collectionTabs: CollectionTab[];
  activeTabData: ActiveTabData;
  handleTabChange: (tabData: ActiveTabData) => void;
}
