import { Modal, Card, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

type CommonModalProps = {
  modalMessage:string,
  resetModal: () => void,
  showModal:boolean
}

const CommonModal = (props:CommonModalProps) => {
  const { modalMessage, resetModal, showModal } = props;
  const handleModalOk = () => {
    resetModal();
  };

  return (
    <Modal title="" centered open={showModal} cancelButtonProps={{ style: { display: "none" } }} closeIcon={<CloseOutlined style={{ border: "2px solid gray", borderRadius: "100%", padding: "2px", fontSize: "14px", fontWeight: "700" }} />} onOk={handleModalOk} onCancel={handleModalOk} footer={null}>
      <Card style={{ marginBottom: "0px", padding: "20px", width: "100%", border: "none" }}>
        <p style={{ paddingBlock: "20px", fontWeight: "500", fontSize: "20px", textAlign: "center" }}> CONFIRMATION </p>
        <p style={{ paddingBlock: "20px", fontWeight: "500", fontSize: "30px", textAlign: "center" }}>{modalMessage}</p>
        <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button type="primary" style={{ paddingInline: "2rem" }} onClick={handleModalOk}>
            OK
          </Button>
        </span>
      </Card>
    </Modal>
  );
};
export default CommonModal;
