using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        // to access the config from apps setting we need to make use of dependency injection
        private readonly IConfiguration _config;
        public DepartmentController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public JsonResult Get()
        {
            // using raw sql here, better to use stored procedures with parameters or an ORM like Entity Framework
            string query = @"select DepartmentId, DepartmentName from dbo.Department";

            DataTable table = new DataTable();
            string sqlDataSource = _config.GetConnectionString("EmployeeAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon=new SqlConnection(sqlDataSource))
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
        //add a new deportment by POSTing {"DepartmentName":"Accounts"}
        public JsonResult Post(Department department)
        {
            string query = @"insert into dbo.Department values ('" + department.DepartmentName + @"')";

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

            return new JsonResult("Added " + department.DepartmentName + " Successfully");
        }
        [HttpPut]
        //update a deportment by PUIting {"DepartmentId":3,"DepartmentName":"Accounts"}
        public JsonResult Put(Department department)
        {
            string query = @"
                            update dbo.Department set
                                DepartmentName='" + department.DepartmentName + @"'
                                where DepartmentId="+department.DepartmentId;

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

            return new JsonResult("Updated " + department.DepartmentName + " Successfully");
        }

        [HttpDelete("{id}")]
        //example DELETE from Postman : http://localhost:14763/api/department/3
        public JsonResult Delete(int id)
        {
            string query = @"
                            delete from dbo.Department 
                                where DepartmentId=" + id;

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

            return new JsonResult("Deleted department " + id);
        }
    }
}
