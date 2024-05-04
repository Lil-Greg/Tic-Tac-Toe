import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CoolModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [choice, setChoice] = useState<boolean | null>(null);

    const handleChoice = (value: boolean | null) => {
        setChoice(value);
        handleClose(); // Close the modal after making a choice
    };

    return (
        <div className="modal-player">
            <p style={{ 'display': 'inline-block' }}>{choice}</p>
            <Button variant="primary" onClick={handleShow}>
                Choose Play Type
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Play Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>Choose Player v. Player or AI</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleChoice(null)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleChoice(true)}>
                        Player v. Player
                    </Button>
                    <Button variant="primary" onClick={() => handleChoice(false)}>
                        Player v. AI
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CoolModal;