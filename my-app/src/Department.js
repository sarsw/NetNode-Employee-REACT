import React, {Component} from 'react';
import {Table} from 'react-bootstrap';

import {Button, ButtonToolbar} from 'react-bootstrap';
import {AddDepModal} from './AddDepModal';
import {EditDepModal} from './EditDepModal';

export class Department extends Component {
    
    // store variables in the state. Department data will be stored here.
    constructor(props) {
        super(props);
        this.state = {deps:[], addModalShow:false, editModalShow:false}
        console.log("const");
    }

    refreshList() {
        console.log("refresh "+process.env.REACT_APP_API);
        fetch("http://localhost:14763/api/department")       //process.env.REACT_APP_API+"department")
        .then(response=>response.json())
        .then(data=>{   // data is available so save it in the state
            this.setState({deps:data});
        });
    }

    componentDidMount() {
        console.log("mount");
        this.refreshList();
    }

    componentDidUpdate() {
        console.log("update");
        this.refreshList();
    }

    deleteDep(depid) {
        if (window.confirm("Delete it?")) {
            fetch("http://localhost:14763/api/department/"+depid,
                {
                    method:'DELETE',
                    header:{'Accept':'application/json','Content-Type':'application/json'
                }
            })
        }
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
                            <td>
                                <ButtonToolbar>
                                    <Button className = "mr-2" variant="info" onClick={()=>this.setState({editModalShow:true, depid:dep.DepartmentId, depname:dep.DepartmentName})}>
                                        Edit
                                    </Button>
                                    <Button className = "mr-2" variant="danger" onClick={()=>this.deleteDep(dep.DepartmentId)}>
                                        X
                                    </Button>

                                    <EditDepModal show={this.state.editModalShow} onHide={editModalClose} depid={depid} depname={depname}/>
                                </ButtonToolbar>
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