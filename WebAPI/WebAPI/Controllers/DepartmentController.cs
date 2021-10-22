using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

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

    }
}
