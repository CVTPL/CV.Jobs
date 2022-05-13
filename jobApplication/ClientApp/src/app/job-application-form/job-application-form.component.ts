import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { JobApplicationService } from '../services/job-application.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.css']
})

export class JobApplicationFormComponent implements OnInit {
  submitForm: FormGroup;
  submitted: boolean = false;
  fileData: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  isShown: boolean;

  private _handleReaderLoaded: any;
    base64textString: string;

  constructor(private formBuilder: FormBuilder, private JobApplicationService: JobApplicationService) { }

  ngOnInit() {
    //var emaleValidation = (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
    this.submitForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      middleName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      lastName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      phoneNumber: ["", [Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]],
      emailId: ["", [Validators.required, Validators.email]],
      position: ["", Validators.required],
      experienceYear: ["", Validators.required],
      experienceMonth: ["", Validators.required],
      noticePeriod: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      currentCtcMonthly: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      expextedCtcMonthly: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      reasonForJobChange: ["", Validators.required],
      relocation: [false, Validators.required],
      resumeFile: ["", Validators.required],
      otherIssues: [""],
      base64string: [""],
      uploadFileName: [""]
    });

    this.dropdownList = [
      { item_id: 1, item_text: 'Better technical growth' },
      { item_id: 2, item_text: 'Want to relocate ahmedabad' },
      { item_id: 3, item_text: 'Financial growth' },
      { item_id: 4, item_text: 'Salary issue' },
      { item_id: 5, item_text: 'Other issues' }
    ];

    this.selectedItems = [
     
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      //allowSearchFilter: true
    }; 
  }
  otherIssue: boolean = false;

  onItemSelect(item: any) {
    if (item.item_id == this.dropdownList[4]["item_id"]) {
      this.isShown = this.otherIssue = true;
    }
    else {
      this.isShown = this.otherIssue;
    }
  }

  onItemDeSelect(item: any) {
   console.log(item);
    if (item.item_id == this.dropdownList[4]["item_id"]) {
      this.otherIssue = false;
      this.isShown = this.otherIssue;
    }
    else {
      this.isShown = this.otherIssue;
    }
  }

  onItemDeSelectAll(items: any) {
    this.isShown = false;
  }
  onSelectAll(items: any) {
    this.isShown = true;
  }

  get validateAngForm() {
    return this.submitForm.controls;
  }

  onSubmit() {
    try {
      this.submitted = true;
      if (this.submitForm.valid) {
        var formData = this.submitForm.value;
        var reasonForJobChange = this.submitForm.value.reasonForJobChange;
        var reasons = [];
        if (reasonForJobChange && reasonForJobChange.length > 0) {
          for (var i = 0; i < reasonForJobChange.length; i++) {
            reasons.push(reasonForJobChange[i].item_text);
          }
          reasons.push()
        }
        formData["reasonForJobChange"] = reasons;
        //console.log(formData);

        //loader Start
        Swal.fire({
          html: 'Please wait...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })

        //Responce Back
        this.JobApplicationService.saveApplyJobClient(this.submitForm.value).subscribe((res:any) => {  

          if (res != null && res != undefined) {
            Swal.close(); //loader close
            this.submitForm.reset();
            this.submitted = false;
            Swal.fire('Your profile is successfully submitted. <span>Our team will contact you very soon on your interested job profile.</span>', '', 'success');
          }
          else {
            Swal.fire('Not submitted!', '', 'error');
          }
        },
          error => {
            console.log(error);
            Swal.fire('Error','', 'error');
          });
      }
    }
    catch (ex) {
      throw ex;
    }
  }

  //form validation to check pdf or doc file in upload resume
  selectFile(event) {
    this.fileData = event.target.files[0];
    if (this.fileData.type != 'application/pdf' && this.fileData.type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      Swal.fire('','File type should be DOCX or PDF!','warning');
      this.submitForm.controls.resumeFile.setValue("");
      return;
    }
    //Validation on Uploaded file(resume) Size
    if (event.target.files[0].size > 5000000) {
      Swal.fire('', 'File size must be under 5Mb!');
      this.submitForm.controls.resumeFile.setValue("");
      return;
    }
  //convert base64
    var files = event.target.files;
    var file = files[0];
    if (files && file) {
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  // SetValue Resume File Name
    var resume = event.target.files[0].name;
    this.submitForm.controls.uploadFileName.setValue(resume);
  }
  //convert base64 and set value
  handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    var finalbase = btoa(binaryString);
    this.submitForm.controls.base64string.setValue(finalbase);
  }
}
