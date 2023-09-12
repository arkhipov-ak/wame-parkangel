import NavBar from "../NavBar";
import styles from "./ResultSearchElement.module.css";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Container from "../common/Container";

const ResultSearchElement = () => {
  const snap = useSnapshot(state);
  console.log('in page');

  return (
    <>
      <NavBar />
      <Container>
        element
      </Container>
    </>
  );
};

export default ResultSearchElement;
