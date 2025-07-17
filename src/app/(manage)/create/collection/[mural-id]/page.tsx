"use client";

import { useState } from "react";

import { CreateCollectionRequest } from "@/lib/api-client/types/request";

import { selectIsAuthenticated } from "@/lib/state/slices/authSlice";
import { useAppSelector } from "@/lib/state/hooks";
import { selectMuralId } from "@/lib/state/slices/muralSlice";

import { PredefinedIcon } from "@/lib/types/predefinedIcon";

import styles from "./create-collection.module.scss";

export default function CreateCollection() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const muralId = useAppSelector(selectMuralId);

  const [formData, setFormData] = useState<CreateCollectionRequest>({
    id: "",
    muralId: muralId,
    isMain: false,
    displayElement: {
      content: "",
      iconConfig: { type: "none" },
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated) {
      console.log("autenticado");
      console.log(formData);

      // fazer a requisição
    } else {
      console.log("não autenticado");
      // redirecionar para /login
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Nova Coleção</h2>

      {/* content */}
      <div className={styles.field}>
        <label htmlFor="content" className={styles.label}>
          Content
        </label>
        <input
          id="content"
          name="content"
          value={formData.displayElement.content}
          onChange={handleInputChange}
          required
          className={styles.input}
        />
      </div>

      {/* iconConfig.type */}
      <div className={styles.field}>
        <label htmlFor="iconType" className={styles.label}>
          Icon Type
        </label>
        <select
          id="iconType"
          name="iconType"
          value={formData.displayElement.iconConfig.type}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="none">None</option>
          <option value="predefined">Predefined</option>
          <option value="custom">Custom</option>
          <option value="emoji">Emoji</option>
        </select>
      </div>

      {/* predefined icon */}
      {formData.displayElement.iconConfig.type === "predefined" && (
        <div className={styles.field}>
          <label htmlFor="icon" className={styles.label}>
            Predefined Icon
          </label>
          <select
            id="icon"
            name="icon"
            value={(formData.displayElement.iconConfig as any).icon || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                iconConfig: {
                  type: "predefined",
                  icon: e.target.value as PredefinedIcon,
                },
              }))
            }
            className={styles.select}
          >
            {Object.values(PredefinedIcon).map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* isMain */}
      <div className={styles.checkboxField}>
        <input
          type="checkbox"
          id="isMain"
          name="isMain"
          checked={formData.isMain}
          onChange={handleInputChange}
          className={styles.checkbox}
        />
        <label htmlFor="isMain" className={styles.checkboxLabel}>
          Is Main
        </label>
      </div>

      <button type="submit" className={styles.submitButton}>
        Criar
      </button>
    </form>
  );
}
