import React,{Component} from 'react';
import {Modal,Button,Row,Col,Form,Image} from 'react-bootstrap';

export class AddEmpModal extends Component {
    constructor(props) {
        super(props);
        this.state={deps:[]};   // for a drop-down of departments to select from
        this.handleSubmit = this.handleSubmit.bind(this);   // bind the handle to this function
        this.handleFileSelect=this.handleFileSelect.bind(this);
    }

    photofilename = "anonymous.png";
    imagesrc = process.env.REACT_APP_PICSPATH+this.photofilename;

    componentDidMount() {       // node lifecycle method to get a list of depts as the page loads
        fetch(process.env.REACT_APP_API+"department")
        .then(response=>response.json())
        .then(data => {
            this.setState({deps:data});
        });

        console.log("Got depts, imagesrc="+this.imagesrc);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(JSON.stringify({
            EmployeeId:1,
            EmployeeName:event.target.EmployeeName.value,
            Department:event.target.Department.value,
            DateOfJoining:event.target.DateOfJoining.value,
            PhotoFileName:this.photofilename
        }));
        fetch(process.env.REACT_APP_API+'employee', {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                EmployeeId:1,
                EmployeeName:event.target.EmployeeName.value,
                Department:event.target.Department.value,
                DateOfJoining:event.target.DateOfJoining.value,
                PhotoFileName:this.photofilename
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert('Failed');
        })
    }

    handleFileSelect(event) {
        event.preventDefault();
        this.photofilename = event.target.files[0].name;
        const formData = new FormData();
        formData.append(
            "myFile",
            event.target.files[0],
            event.target.files[0].name
        );

        fetch(process.env.REACT_APP_API+'Employee/SaveFile', {
            method:'POST',
            body:formData
        })
        .then(res=>res.json())
        .then((result)=>{
            this.imagesrc=process.env.REACT_APP_PICSPATH+result;
        },
        (error)=>{
            alert('Failed');
        });
    }

    render() {
        return (
            <div className="container">
                <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Employee
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="EmployeeName">
                                        <Form.Label>EmployeeName</Form.Label>
                                        <Form.Control type="text" name="EmployeeName" required placeholder="EmployeeName"/>
                                    </Form.Group>
                                    <Form.Group controlId="Department">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control as="select">
                                            {this.state.deps.map(
                                                dep=>
                                                <option key={dep.DepartmentId}>{dep.DepartmentName}</option>
                                            )}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="DateOfJoining">
                                        <Form.Label>Date Joined</Form.Label>
                                        <Form.Control type="date" name="DateOfJoining" required placeholder="Joined Date"/>
                                    </Form.Group>                                    
                                    <Form.Group>
                                        <Button variant="primary" type="submit">
                                            Add Employee
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <Image width="200px" height="200px" src={this.imagesrc}/>
                                <input onChange={this.handleFileSelect} type="File"/>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}