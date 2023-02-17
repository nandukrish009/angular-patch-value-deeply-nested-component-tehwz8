import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  cvForm: FormGroup;
  dataModel: any; //active model
  storeData: any;  //save to disk model
  constructor(private _fb: FormBuilder) { }

  showValue(){
    return this.cvForm.getRawValue();
  }

  showSavedValue(){
    return this.dataModel;
  }

  saveForm(){
    //save form values to ojbect and reset the form
    this.storeData = this.cvForm.getRawValue();
    this.cvForm.reset();
    // reset will not remove form elements added already
    //to the formarrays so we need to purge those as well
    //without losing our subscription! 
     (this.cvForm.get("lines") as FormArray)['controls'].splice(0);
   
   
  }

  changeValueInSaveData(){
    // in angular 7 there is no 2 way binding, i have
    // to actually force the change on the control itse;f
    // FAILS TO UPDATE UI :
    // this.saveData.team_name = "changed";
    //this will update the UI and because i'm subscribed
    //to form.valuechanges, it will update the model as well
    this.cvForm.get('team_name').setValue("changed");
  }

  loadFormAction(){
    this.loadForm(this.storeData);
  }

  loadForm(data){
  //create lines array first
    for (let line = 0; line < data.lines.length; line++){
      const linesFormArray = this.cvForm.get("lines") as FormArray;
      linesFormArray.push(this.line);
      
      for (let player=0; player < data.lines[line].players.length; player++){
        const playersFormsArray = linesFormArray.at(line).get("players") as FormArray;
        playersFormsArray.push(this.player);
      }
    }
    //once we setup the form with all the arrays and such, we cna just
    //patch the form:
    this.cvForm.patchValue(data);
  }

  seedForm():void{
    //seed the form with sample data
    this.loadForm(seedData);
  }

  get player():FormGroup{
    return this._fb.group({
                first_name: '',
                last_name: ''
              });
  }
  //get functions cannot have parameters...
  get line():FormGroup{
    return this._fb.group({
          name: '',
          players: this._fb.array([
            ]),
          })
  }

  ngOnInit() {
    this.dataModel = Object.create(null);
    
    //each team has at least one line and each line has at least
    //3 players, so let's set that up as the default
    this.cvForm = this._fb.group({
      team_name: ['', [Validators.required]],
      id:[''],
      lines: this._fb.array([
        ])      
    });

    //subscribe to value changes on form
     this.cvForm.valueChanges.subscribe(data=>{
      this.dataModel = data;
     });
  }
}

const seedData =  {
  "team_name": "Team",
  "id":"this_is_id",
  "lines": [
    {
      "name": "line a",
      "players": [
        {
          "first_name": "nandu",
          "last_name": "krishna"
        },
        {
          "first_name": "2a",
          "last_name": ""
        },
        {
          "first_name": "3a",
          "last_name": ""
        }
      ]
    },
    {
      "name": "line b",
      "players": [
        {
          "first_name": "1b",
          "last_name": ""
        },
        {
          "first_name": "2b",
          "last_name": ""
        },
        {
          "first_name": "3b",
          "last_name": ""
        }
      ]
    },
    {
      "name": "line c",
      "players": [
        {
          "first_name": "1c",
          "last_name": ""
        },
        {
          "first_name": "2c",
          "last_name": ""
        },
        {
          "first_name": "3c",
          "last_name": ""
        }
      ]
    }
  ]
}
