# App that returns the employee pair with longest overlap on multiple projects

When file is provided the app checks to see if:

- it is correct format
- it has any data

Then it tries to parse the data, stops if issue is found:

- missing header "EmpID", "ProjectID", "DateFrom", "DateTo"
- no data after header
- data has less than 4 values per row

After parsing it's time to map:

- add each project id to Set
- then filter all data about each project
- check if multiple employees worked on the project
- calculate the overlap time
- and if any overlap save the pair and time

After mapping each project to include pairs and overlap time, map all pairs:

- get each pair from each project
- if pair is not added to pairs[] add it
- else add to the pair overlap time

Finally display the pair with the most overlap and each project overlap
