import React, {Component} from 'react';
import {Table} from 'react-bootstrap';

export class Department extends Component {
    
    // store variables in the state. Department data will be stored here.
    constructor(props) {
        super(props);
        this.state = {deps:[]}
        console.log("const");
    }

    refreshList() {
        fetch("http://localhost:14763/api/department")      //process.env.REACT_APP_API+"department")
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
        const {deps}=this.state; // use bootstrap to display the data with additional edit/delete column
        return(
            <div>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>DepartmentId</tr>
                        <tr>DepartmentName</tr>
                        <tr>Modify</tr> 
                    </thead>
                    <tbody>
                        {deps.map(dep=>
                        <tr key={dep.DepartmentId}>
                            <td>{dep.DepartmentId}</td>
                            <td>{dep.DepartmentName}</td>
                            <td>Edit / Delete</td>
                        </tr>)}
                    </tbody>
                </Table>
            </div>
        )
    }
}