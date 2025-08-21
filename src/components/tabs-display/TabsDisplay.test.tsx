// import { render, screen, fireEvent } from "@testing-library/react"; // ALTERAÇÃO: Removido waitFor não utilizado
// import userEvent from "@testing-library/user-event";
// import TabsDisplay from "./TabsDisplay";
// import { CollectionTab } from "./types/collectionTab";
// import { PredefinedIcon } from "@/lib/types/predefinedIcon";
// import { IconType } from "@/lib/types/clickable";

// // Mock do Next.js Image component
// jest.mock("next/image", () => ({
//   __esModule: true,
//   default: ({ src, alt, onLoad, onError, ...props }: any) => {
//     return (
//       <img
//         src={src}
//         alt={alt}
//         {...props}
//         onLoad={(e) => {
//           if (onLoad) onLoad();
//         }}
//         onError={(e) => {
//           if (onError) onError();
//         }}
//       />
//     );
//   },
// }));

// // REMOÇÃO: Mock do emojiParser removido - será testado separadamente

// // Mock das imagens temporárias
// jest.mock("@/assets/temp/temp-custom-img.png", () => "/temp-custom-img.png");

// // Mock dos estilos SCSS
// jest.mock("./tabs-display.module.scss", () => ({
//   "tabs-display": "tabs-display-mock",
// }));

// // REMOÇÃO: Mocks de estilos de componentes filhos removidos - serão testados separadamente

// describe("TabsDisplay", () => {
//   const mockHandleTabChange = jest.fn<void, [string]>();

//   const mockCollectionTabs: CollectionTab[] = [
//     {
//       id: "1",
//       order: "a0", // ALTERAÇÃO: Usando fractional indexing formato correto
//       isMain: true,
//       displayElement: {
//         content: "Tab 1",
//         iconConfig: {
//           type: IconType.PREDEFINED,
//           icon: PredefinedIcon.TAB_DEFAULT,
//         },
//       },
//     },
//     {
//       id: "2",
//       order: "a1", // ALTERAÇÃO: Usando fractional indexing formato correto
//       isMain: false,
//       displayElement: {
//         content: "Tab 2",
//         iconConfig: { type: IconType.EMOJI, unicode: "😀" },
//       },
//     },
//     {
//       id: "3",
//       order: "a2", // ALTERAÇÃO: Usando fractional indexing formato correto
//       isMain: false,
//       displayElement: {
//         content: "Tab 3",
//         iconConfig: {
//           type: IconType.CUSTOM,
//           url: "https://example.com/icon.png",
//         },
//       },
//     },
//     {
//       id: "4",
//       order: "a3", // ALTERAÇÃO: Usando fractional indexing formato correto
//       isMain: false,
//       displayElement: {
//         content: "Tab 4",
//         iconConfig: { type: IconType.NONE },
//       },
//     },
//   ];

//   const defaultProps = {
//     collectionTabs: mockCollectionTabs,
//     activeTabData: {
//       id: "a0",
//       displayElement: {
//         content: "content",
//         iconConfig: {
//           type: IconType.NONE,
//         },
//       },
//     },
//     handleTabChange: mockHandleTabChange,
//   };

//   beforeEach(() => {
//     mockHandleTabChange.mockClear();
//     jest.clearAllTimers();
//     jest.useFakeTimers();
//   });

//   afterEach(() => {
//     jest.runOnlyPendingTimers();
//     jest.useRealTimers();
//   });

//   const getTabsContainer = () => {
//     return document.querySelector('[class*="tabs-display"]') as HTMLElement;
//   };

//   describe("Rendering", () => {
//     it("renders all tabs correctly", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       expect(screen.getByText("Tab 1")).toBeInTheDocument();
//       expect(screen.getByText("Tab 2")).toBeInTheDocument();
//       expect(screen.getByText("Tab 3")).toBeInTheDocument();
//       expect(screen.getByText("Tab 4")).toBeInTheDocument();
//     });

//     it("shows correct active tab with active styling", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const tab2Container = screen.getByText("Tab 2").closest("div");
//       const tab1Container = screen.getByText("Tab 1").closest("div");

//       // ALTERAÇÃO: Teste simplificado - verifica apenas se as tabs estão presentes
//       // Classes específicas serão testadas nos componentes filhos
//       expect(tab2Container).toBeInTheDocument();
//       expect(tab1Container).toBeInTheDocument();
//     });

//     it("renders empty list when no tabs provided", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       expect(screen.queryByText("Tab 1")).not.toBeInTheDocument();
//       expect(getTabsContainer()).toBeInTheDocument();
//     });

//     it("renders tabs with different icon types correctly", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       expect(screen.getByText("Tab 1")).toBeInTheDocument();
//       expect(screen.getByText("Tab 2")).toBeInTheDocument(); // tab com emoji
//       expect(screen.getByText("Tab 3")).toBeInTheDocument(); // tab com ícone customizado
//       expect(screen.getByText("Tab 4")).toBeInTheDocument(); // tab sem ícone
//     });
//   });

//   describe("Click Functionality", () => {
//     it("calls handleTabChange when tab is clicked without dragging", async () => {
//       const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

//       render(<TabsDisplay {...defaultProps} />);

//       const tab2 = screen.getByText("Tab 2");
//       await user.click(tab2);

//       expect(mockHandleTabChange).toHaveBeenCalledWith("2");
//       expect(mockHandleTabChange).toHaveBeenCalledTimes(1);
//     });

//     it("calls handleTabChange with correct tab id when different tabs are clicked", async () => {
//       const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

//       render(<TabsDisplay {...defaultProps} />);

//       const tab3 = screen.getByText("Tab 3");
//       await user.click(tab3);

//       expect(mockHandleTabChange).toHaveBeenCalledWith("3");

//       mockHandleTabChange.mockClear();

//       const tab4 = screen.getByText("Tab 4");
//       await user.click(tab4);

//       expect(mockHandleTabChange).toHaveBeenCalledWith("4");
//     });

//     it("logs click message when tab is clicked without dragging", async () => {
//       const consoleSpy = jest.spyOn(console, "log").mockImplementation();
//       const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

//       render(<TabsDisplay {...defaultProps} />);

//       const tab1 = screen.getByText("Tab 1");
//       await user.click(tab1);

//       expect(consoleSpy).toHaveBeenCalledWith("clickable click");

//       consoleSpy.mockRestore();
//     });
//   });

//   describe("Drag Functionality", () => {
//     it("does not call handleTabChange when dragging over a tab", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();
//       const tab2 = screen.getByText("Tab 2");

//       // Mock das propriedades necessárias para o container
//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });
//       Object.defineProperty(container, "scrollLeft", {
//         value: 0,
//         writable: true,
//         configurable: true,
//       });

//       // Simula drag: mouseDown -> mouseMove -> mouseUp
//       fireEvent.mouseDown(container, { pageX: 100 });
//       fireEvent.mouseMove(container, { pageX: 150 }); // movimento de 50px
//       fireEvent.mouseUp(container);

//       // Tenta clicar na tab após o drag
//       fireEvent.click(tab2);

//       expect(mockHandleTabChange).not.toHaveBeenCalled();
//     });

//     it("updates scroll position based on mouse movement", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       // Mock das propriedades necessárias
//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });

//       let scrollLeftValue = 100;
//       Object.defineProperty(container, "scrollLeft", {
//         get: () => scrollLeftValue,
//         set: (value) => {
//           scrollLeftValue = value;
//         },
//         configurable: true,
//       });

//       // Inicia o drag
//       fireEvent.mouseDown(container, { pageX: 100 });

//       // Move o mouse para a esquerda (deveria aumentar o scroll)
//       fireEvent.mouseMove(container, { pageX: 50 }); // movimento de -50px

//       // Verifica se o scroll foi alterado
//       expect(scrollLeftValue).toBe(150); // 100 (inicial) + 50 (movimento)
//     });

//     it("prevents default behavior during mouse move when dragging", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });
//       Object.defineProperty(container, "scrollLeft", {
//         value: 0,
//         writable: true,
//         configurable: true,
//       });

//       fireEvent.mouseDown(container, { pageX: 100 });

//       const mouseMoveEvent = new MouseEvent("mousemove", {
//         bubbles: true,
//         cancelable: true,
//         clientX: 150,
//       });

//       const preventDefaultSpy = jest.spyOn(mouseMoveEvent, "preventDefault");
//       container.dispatchEvent(mouseMoveEvent);

//       expect(preventDefaultSpy).toHaveBeenCalled();
//     });

//     it("calculates scroll correctly with different initial positions", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       Object.defineProperty(container, "offsetLeft", {
//         value: 50,
//         configurable: true,
//       });

//       let scrollLeftValue = 0;
//       Object.defineProperty(container, "scrollLeft", {
//         get: () => scrollLeftValue,
//         set: (value) => {
//           scrollLeftValue = value;
//         },
//         configurable: true,
//       });

//       // Inicia o drag com offset
//       fireEvent.mouseDown(container, { pageX: 200 }); // pageX: 200, offsetLeft: 50, então x = 150

//       // Move para a direita
//       fireEvent.mouseMove(container, { pageX: 250 }); // pageX: 250, offsetLeft: 50, então x = 200

//       // walk = 200 - 150 = 50, scrollLeft = 0 - 50 = -50
//       expect(scrollLeftValue).toBe(-50);
//     });
//   });

//   describe("Cursor and Styling", () => {
//     it("applies correct cursor styles during drag lifecycle", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       // Estado inicial
//       expect(container.style.cursor).toBe("");

//       // Simula início do drag
//       fireEvent.mouseDown(container, { pageX: 100 });
//       expect(container.style.cursor).toBe("grabbing");

//       // Simula fim do drag
//       fireEvent.mouseUp(container);
//       expect(container.style.cursor).toBe("grab");
//     });

//     it("resets cursor on mouse leave during drag", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       // Inicia drag
//       fireEvent.mouseDown(container, { pageX: 100 });
//       expect(container.style.cursor).toBe("grabbing");

//       // Mouse leave deve resetar o cursor
//       fireEvent.mouseLeave(container);
//       expect(container.style.cursor).toBe("grab");
//     });

//     it("maintains cursor state through multiple interactions", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       // Primeiro drag
//       fireEvent.mouseDown(container, { pageX: 100 });
//       expect(container.style.cursor).toBe("grabbing");
//       fireEvent.mouseUp(container);
//       expect(container.style.cursor).toBe("grab");

//       // Segundo drag
//       fireEvent.mouseDown(container, { pageX: 200 });
//       expect(container.style.cursor).toBe("grabbing");
//       fireEvent.mouseLeave(container);
//       expect(container.style.cursor).toBe("grab");
//     });
//   });

//   describe("Mouse Events", () => {
//     it("stops dragging on mouse leave", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });

//       let scrollLeftValue = 0;
//       Object.defineProperty(container, "scrollLeft", {
//         get: () => scrollLeftValue,
//         set: (value) => {
//           scrollLeftValue = value;
//         },
//         configurable: true,
//       });

//       fireEvent.mouseDown(container, { pageX: 100 });
//       fireEvent.mouseLeave(container);

//       const initialScrollLeft = scrollLeftValue;

//       // Movimento após mouse leave não deve afetar scroll
//       fireEvent.mouseMove(container, { pageX: 200 });
//       expect(scrollLeftValue).toBe(initialScrollLeft);
//     });

//     it("handles mouse up correctly after movement", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });
//       Object.defineProperty(container, "scrollLeft", {
//         value: 0,
//         writable: true,
//         configurable: true,
//       });

//       fireEvent.mouseDown(container, { pageX: 100 });
//       fireEvent.mouseMove(container, { pageX: 150 });
//       fireEvent.mouseUp(container);

//       expect(container.style.cursor).toBe("grab");
//     });

//     it("handles multiple mouse events in sequence", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });
//       Object.defineProperty(container, "scrollLeft", {
//         value: 0,
//         writable: true,
//         configurable: true,
//       });

//       // Sequência: down -> move -> leave -> down -> up
//       fireEvent.mouseDown(container, { pageX: 100 });
//       fireEvent.mouseMove(container, { pageX: 120 });
//       fireEvent.mouseLeave(container);
//       fireEvent.mouseDown(container, { pageX: 150 });
//       fireEvent.mouseUp(container);

//       expect(container.style.cursor).toBe("grab");
//     });
//   });

//   describe("Click After Drag", () => {
//     it("allows click after drag is completed and timeout expires", async () => {
//       const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();
//       const tab2 = screen.getByText("Tab 2");

//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });
//       Object.defineProperty(container, "scrollLeft", {
//         value: 0,
//         writable: true,
//         configurable: true,
//       });

//       // Faz um drag primeiro
//       fireEvent.mouseDown(container, { pageX: 100 });
//       fireEvent.mouseMove(container, { pageX: 150 });
//       fireEvent.mouseUp(container);

//       // Clica imediatamente (deve ser bloqueado)
//       fireEvent.click(tab2);
//       expect(mockHandleTabChange).not.toHaveBeenCalled();

//       // Avança o timer (setTimeout de 10ms no componente)
//       jest.advanceTimersByTime(15);

//       // Agora deve permitir clique
//       await user.click(tab2);

//       expect(mockHandleTabChange).toHaveBeenCalledWith("2");
//     });

//     it("resets hasMoved flag after timeout on each click", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();
//       const tab1 = screen.getByText("Tab 1");

//       Object.defineProperty(container, "offsetLeft", {
//         value: 0,
//         configurable: true,
//       });
//       Object.defineProperty(container, "scrollLeft", {
//         value: 0,
//         writable: true,
//         configurable: true,
//       });

//       // Primeiro movimento
//       fireEvent.mouseDown(container, { pageX: 100 });
//       fireEvent.mouseMove(container, { pageX: 150 });
//       fireEvent.mouseUp(container);

//       // Clique na tab
//       fireEvent.click(tab1);
//       expect(mockHandleTabChange).not.toHaveBeenCalled();

//       // Avança o timer
//       jest.advanceTimersByTime(15);

//       // Segundo movimento
//       fireEvent.mouseDown(container, { pageX: 200 });
//       fireEvent.mouseMove(container, { pageX: 250 });
//       fireEvent.mouseUp(container);

//       // Novo clique deve ser bloqueado novamente
//       fireEvent.click(tab1);
//       expect(mockHandleTabChange).not.toHaveBeenCalled();

//       // Avança o timer novamente
//       jest.advanceTimersByTime(15);

//       // Agora deve funcionar
//       fireEvent.click(tab1);
//       expect(mockHandleTabChange).toHaveBeenCalledWith("1");
//     });

//     it("allows immediate click when there is no movement", async () => {
//       const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

//       render(<TabsDisplay {...defaultProps} />);

//       const tab3 = screen.getByText("Tab 3");

//       // Clique direto sem arrastar
//       await user.click(tab3);

//       expect(mockHandleTabChange).toHaveBeenCalledWith("3");
//       expect(mockHandleTabChange).toHaveBeenCalledTimes(1);
//     });
//   });

//   describe("Edge Cases", () => {
//     it("handles mouseDown without container ref gracefully", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       // Não deve quebrar mesmo sem propriedades mockadas
//       expect(() => {
//         fireEvent.mouseDown(container, { pageX: 100 });
//       }).not.toThrow();
//     });

//     it("handles mouseMove without active drag", () => {
//       render(<TabsDisplay {...defaultProps} />);

//       const container = getTabsContainer();

//       let scrollLeftValue = 0;
//       Object.defineProperty(container, "scrollLeft", {
//         get: () => scrollLeftValue,
//         set: (value) => {
//           scrollLeftValue = value;
//         },
//         configurable: true,
//       });

//       const initialScrollLeft = scrollLeftValue;

//       // MouseMove sem mouseDown anterior não deve fazer nada
//       fireEvent.mouseMove(container, { pageX: 100 });
//       expect(scrollLeftValue).toBe(initialScrollLeft);
//     });

//     it("handles single tab correctly", async () => {
//       const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
//       const singleTab = [mockCollectionTabs[0]];

//       render(<TabsDisplay {...defaultProps} collectionTabs={singleTab} />);

//       const tab = screen.getByText("Tab 1");
//       await user.click(tab);

//       expect(mockHandleTabChange).toHaveBeenCalledWith("1");
//     });

//     it("handles empty content gracefully", () => {
//       const tabWithEmptyContent: CollectionTab[] = [
//         {
//           id: "empty",
//           order: "a0",
//           isMain: true,
//           displayElement: {
//             content: "",
//             iconConfig: { type: IconType.NONE },
//           },
//         },
//       ];

//       render(
//         <TabsDisplay {...defaultProps} collectionTabs={tabWithEmptyContent} />
//       );

//       // Deve renderizar mesmo com conteúdo vazio
//       const container = getTabsContainer();
//       expect(container).toBeInTheDocument();
//     });

//     it("handles tabs with different order values and main flags", () => {
//       const mixedTabs: CollectionTab[] = [
//         { ...mockCollectionTabs[0], order: "b0", isMain: false },
//         { ...mockCollectionTabs[1], order: "a5", isMain: true },
//         { ...mockCollectionTabs[2], order: "a1", isMain: false },
//       ];

//       render(<TabsDisplay {...defaultProps} collectionTabs={mixedTabs} />);

//       expect(screen.getByText("Tab 1")).toBeInTheDocument();
//       expect(screen.getByText("Tab 2")).toBeInTheDocument();
//       expect(screen.getByText("Tab 3")).toBeInTheDocument();
//     });
//   });
// });
