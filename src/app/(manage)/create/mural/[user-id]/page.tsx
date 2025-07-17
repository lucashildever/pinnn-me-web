"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api-client/apiClient";
import { CreateMuralRequest } from "@/lib/api-client/types/request";

import styles from "./create-mural.module.scss";

export default function CreateMuralPage() {
  const router = useRouter();

  const [muralName, setMuralName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createMuralRequest: CreateMuralRequest = {
      name: muralName,
      displayName: displayName,
    };

    const result = await apiClient.mural.create(createMuralRequest); // ✅ Await

    if (result.success) {
      const muralName = result.data.name;
      router.push(`/${muralName}`);
    } else if (result.error === "UNAUTHORIZED") {
      // talvez criar uma mensagem na ui para o usuario refazer o login
      router.push("/login");
    }
  };

  return (
    <form id={styles["create-mural-form"]} onSubmit={handleSubmit}>
      <label htmlFor="muralName">mural Name {"(mural link)"}</label>
      <input
        type="text"
        id="muralName"
        onChange={(e) => setMuralName(e.target.value)}
      />
      <label htmlFor="displayName">display Name</label>
      <input
        type="text"
        id="displayName"
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <button type="submit">create mural</button>
    </form>
  );
}
