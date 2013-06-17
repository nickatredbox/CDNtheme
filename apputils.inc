<script language="VBScript" runat="Server">

sub AppLog(msg)

	Err.Clear
	On Error Resume Next
		
    dim ObjMyFile
	Set ObjMyFile = CreateObject("Scripting.FileSystemObject")
	dim LogFileName
	dim LogFileDirectory
	dim WriteMyData
	dim RowHeaderString 
	dim dt
	dim ms
	
	
	dt = NOW
	
	ms = timer - datediff("s", (Month(dt) & "-" & Day(dt) & "-" & Year(dt) & " 00:00:00"), now)
	
	'response.write("ms: " & ms)
	'response.write("Q: " & Month(dt)&"-"&Day(dt)&"-"&Year(dt))

	
	LogFileName = "QuizLog-" & Month(dt) & "-" & Day(dt) & "-" & Year(dt) & ".log"
	
	'response.write("F: " & LogFileName)
	LogFileDirectory = Application("LogPath") & "..\"'N.B. One level up from the problem folder
	  
	'Open Text File.. If doesn't exist create it and append to it .. If exists just append to it
	Set WriteMyData = ObjMyFile.OpenTextFile(LogFileDirectory & "\quiz\logs\" & LogFileName,8,True)
	
	if Session("EMPLID") <> "" then
		RowHeaderString = Session("EMPLID") & vbTab
	else
		RowHeaderString = "PEOPLESOFTID" & vbTab
    end if
	
	RowHeaderString = RowHeaderString & Session("Username") & vbTab & Session("NAME") & vbTab 
    RowHeaderString = RowHeaderString & vbTab & Request.ServerVariables("REMOTE_ADDR")& vbTab
	RowHeaderString = RowHeaderString & Hour(dt) & ":" & Minute(dt) & ":" & FormatNumber((Second(dt) + ms), 4) & vbTab

	WriteMyData.WriteLine(RowHeaderString & vbTab & msg)

	WriteMyData.Close
	On Error GoTo 0

end sub

</script>