using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobApplicationModal;
using Microsoft.SharePoint.Client;
using System.Security;
using System.Net.Http;
using System.Text.Json;
using System.Web;
using System.Text;
using System.IO;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace jobApplication.Controllers
{
    [Route("api/JobApplicationAction/")]
    [ApiController]
    public class JobApplicationActionController : ControllerBase
    {

        static string SiteURL = "https://cidev.sharepoint.com/sites/CVRahul";
        //static string SiteURL = "https://cidev.sharepoint.com/sites/Powerapp";
        static string userName = "jshah@cidev.onmicrosoft.com";
        static string pwdS = "Codev#123456";
        static string LibraryName = "JobApplicationsList";
        //static string LibraryName = "PreEmployment";

        // GET: api/<JobApplicationActionController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<JobApplicationActionController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        } 

        // POST api/<JobApplicationActionController>
        [HttpPost]
        //[Route("saveJobApplicationData")]
        public async Task<JobApplicationData> saveJobApplicationData(JobApplicationData JobApplicationData)
        {
            try
            {
                var httpClient = new HttpClient();
                string token = "";
               // var status = "In progress";
                SecureString pwd = new SecureString();
                foreach (char c in pwdS.ToCharArray()) pwd.AppendChar(c);
                var clientID = "d37f8cbc-9d6b-4022-89fb-59785492ab1b";
                var resource = "https://cidev.sharepoint.com";
                var tokenEndpoint = "https://login.microsoftonline.com/common/oauth2/token";
                var body = $"resource={resource }&client_id={clientID}&grant_type=password&username={HttpUtility.UrlEncode(userName)}&password={HttpUtility.UrlEncode(pwdS)}";
                using (var stringContent = new StringContent(body, Encoding.UTF8, "application/x-www-form-urlencoded"))
                {
                    var result = await httpClient.PostAsync(tokenEndpoint, stringContent).ContinueWith((response) =>
                    {
                        return response.Result.Content.ReadAsStringAsync().Result;
                    });
                    var tokenResult = JsonSerializer.Deserialize<JsonElement>(result);
                    token = tokenResult.GetProperty("access_token").GetString();
                }

                var ctx = new ClientContext(new Uri(SiteURL));
                ctx.ExecutingWebRequest += (sender, e) =>
                {
                    e.WebRequestExecutor.RequestHeaders["Authorization"] = "Bearer " + token;
                };
                List oList = ctx.Web.Lists.GetByTitle(LibraryName);

                ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();
                ListItem oListItem = oList.AddItem(itemCreateInfo);  
                oListItem["CV_FirstName"] = JobApplicationData.firstName;
                oListItem["CV_MiddleName"] = JobApplicationData.middleName;
                oListItem["CV_LastName"] = JobApplicationData.lastName;
                oListItem["CV_PhoneNumber"] = JobApplicationData.phoneNumber;
                oListItem["CV_Email"] = JobApplicationData.emailId;
                oListItem["CV_Position"] = JobApplicationData.position;
                oListItem["CV_ExperienceYear"] = JobApplicationData.experienceYear;
                oListItem["CV_ExperienceMonth"] = JobApplicationData.experienceMonth;
                oListItem["CV_NoticePeriod"] = JobApplicationData.noticePeriod;
                oListItem["CV_CurrentCtcMonthly"] = JobApplicationData.currentCtcMonthly;
                oListItem["CV_ExpextedCtcMonthly"] = JobApplicationData.expextedCtcMonthly;
                oListItem["CV_ReasonForJobChange"] = JobApplicationData.reasonForJobChange;
                oListItem["CV_OtherIssues"] = JobApplicationData.otherIssues;
                oListItem["CV_Relocation"] = JobApplicationData.relocation;
                //oListItem["Attachments"] = JobApplicationData.resumeFile;
                oListItem.Update();
                ctx.ExecuteQuery();
                
                var filExtension = JobApplicationData.uploadFileName.Split(".");
                var fileName = JobApplicationData.phoneNumber + "." + filExtension[1];
                byte[] bytes = Convert.FromBase64String(JobApplicationData.base64string);
                AttachmentCreationInformation newFile = new AttachmentCreationInformation();
                newFile.ContentStream = new MemoryStream(bytes);
                newFile.FileName = fileName;                
                oListItem.AttachmentFiles.Add(newFile);                
                ctx.ExecuteQuery();
                JobApplicationData.itemId = oListItem.Id;       
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return JobApplicationData;
        }
        // PUT api/<JobApplicationActionController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<JobApplicationActionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
