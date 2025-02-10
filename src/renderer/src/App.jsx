import MainContent from "./components/Content/MainContent";
import Header from "./components/Header/Header";
import Navigation from "./components/Navigation/Navigation";

function App() {
  return (
    <main className="w-full h-full bg-main">
      <Header></Header>
      <div className="flex h-[90%]">
        <Navigation></Navigation>
        <MainContent></MainContent>
      </div>
    </main>
  );
}

export default App;
