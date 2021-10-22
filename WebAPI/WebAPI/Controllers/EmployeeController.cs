﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        // to access the config from apps setting we need to make use of dependency injection
        private readonly IConfiguration _config;
        public EmployeeController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public JsonResult Get()
        {
            // using raw sql here, better to use stored procedures with parameters or an ORM like Entity Framework
            string query = @"select EmployeeId, EmployeeName, Department,
                                convert(varchar(10),DateOfJoining,120) as DateOfJoining,
                                PhotoFileName
                                from dbo.Employee";

            DataTable table = new DataTable();
            string sqlDataSource = _config.GetConnectionString("EmployeeAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCmd = new SqlCommand(query, myCon))
                {
                    myReader = myCmd.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpPost]
        //add a new deportment by POSTing     {"EmployeeName": "Bobbo","Department": "MD","DateOfJoining": "2021-04-22","PhotoFileName": "anonymous.png"}
    public JsonResult Post(Employee e)
        {
            string query = @"insert into dbo.Employee
                                (EmployeeName, Department, PhotoFileName, DateOfJoining )
                                values (
                                '" + e.EmployeeName + @"',
                                '" + e.Department + @"',
                                '" + e.PhotoFileName+ @"',
                                '" + e.DateOfJoining+ @"'
                                )";

            DataTable table = new DataTable();
            string sqlDataSource = _config.GetConnectionString("EmployeeAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCmd = new SqlCommand(query, myCon))
                {
                    myReader = myCmd.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Added " + e.EmployeeName + " Successfully");
        }
        [HttpPut]
        //update an employee by PUIting {"EmployeeId": 1,"EmployeeName": "Sammy","Department": "IT","DateOfJoining": "2021-04-22","PhotoFileName": "anonymous.png"}
    public JsonResult Put(Employee e)
        {
            string query = @"
                            update dbo.Employee set
                                EmployeeName='" + e.EmployeeName + @"',
                                Department='" + e.Department+ @"',
                                PhotoFileName='" + e.PhotoFileName+ @"',
                                DateOfJoining='" + e.DateOfJoining + @"'
                                where EmployeeId=" + e.EmployeeId;

            DataTable table = new DataTable();
            string sqlDataSource = _config.GetConnectionString("EmployeeAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCmd = new SqlCommand(query, myCon))
                {
                    myReader = myCmd.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Updated " + e.EmployeeName + " Successfully");
        }

        [HttpDelete("{id}")]
        //example DELETE from Postman : http://localhost:14763/api/employee/3
        public JsonResult Delete(int id)
        {
            string query = @"
                            delete from dbo.Employee 
                                where EmployeeId=" + id;

            DataTable table = new DataTable();
            string sqlDataSource = _config.GetConnectionString("EmployeeAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCmd = new SqlCommand(query, myCon))
                {
                    myReader = myCmd.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Deleted Employee " + id);
        }

    }
}
