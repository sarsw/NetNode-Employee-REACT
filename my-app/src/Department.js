import React, {Component} from 'react';
import {Table} from 'react-bootstrap';

import {Button, ButtonToolbar} from 'react-bootstrap';
import {AddDepModal} from './AddDepModal';

export class Department extends Component {
    
    // store variables in the state. Department data will be stored here.
    constructor(props) {
        super(props);
        this.state = {deps:[], addModalShow:false, editModalShow:false}
        console.log("const");
    }

    refreshList() {
        console.log("refresh"+process.env.REACT_APP_API);
        fetch("http://localhost:14763/api/department")       //process.env.REACT_APP_API+"department")
        .then(response=>response.json())
        .then(data=>{   // data is available so save it in the state
            this.setState({deps:data});
        });
    }

    componentWillMount() {
        console.log("willMount");
    }

    // lifecycle method used to refresh our list
    componentDidMount() {
        console.log("mount");
        this.refreshList();
    }

    componentDidUpdate() {
        console.log("update");
        this.refreshList();
    }

    render() {
        const {deps, depid, depname}=this.state; // use bootstrap to display the data with additional edit/delete column
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>DepartmentId</th>
                            <th>DepartmentName</th>
                            <th>Modify</th>
                        </tr> 
                    </thead>
                    <tbody>
                        {deps.map(dep=>
                        <tr key={dep.DepartmentId}>
                            <td>{dep.DepartmentId}</td>
                            <td>{dep.DepartmentName}</td>
                            <td>Edit/Del
                            </td>
                        </tr>)}
                    </tbody>
                </Table>
                <ButtonToolbar>
                    <Button variant='primary' onClick={()=>this.setState({addModalShow:true})}>
                        Add Department
                    </Button>
                    <AddDepModal show={this.state.addModalShow} onHide={addModalClose}/>
                </ButtonToolbar>
            </div>
        )
    }
}