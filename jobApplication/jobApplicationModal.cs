using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace JobApplicationModal
{
   public class JobApplicationData
    {
        public string firstName { get; set; }
        public string middleName { get; set; }
        public string lastName { get; set; }
        public string phoneNumber { get; set; }
        public string emailId { get; set; }
        public string position { get; set; }
        public string experienceYear { get; set; }
        public string experienceMonth { get; set; }
        public string noticePeriod { get; set; }
        public int currentCtcMonthly { get; set; }
        public int expextedCtcMonthly { get; set; }
        public List<string> reasonForJobChange { get; set; }
        public bool relocation { get; set; }
        public string otherIssues { get; set; }
        public int itemId{ get; set; }
        public string base64string { get; set; }
        public string uploadFileName { get; set; }

    }
}
