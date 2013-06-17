<% @Language="VBScript" %>
<!--#INCLUDE FILE="apputils.inc"-->
<%

Option Explicit 

sub SaveQuiz(user)

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
	
	LogFileName = "Quiz-" & user & "-" & Month(dt) & "-" & Day(dt) & "-" & Year(dt) & ".log"
	
	LogFileDirectory = Application("LogPath") & "..\"'N.B. One level up from the problem folder
	  
	'Open Text File.. If doesn't exist create it and append to it .. If exists just append to it
	Set WriteMyData = ObjMyFile.OpenTextFile(LogFileDirectory & "\" & LogFileName, 8, True)
	
	if Session("EMPLID") <> "" then
		RowHeaderString = Session("EMPLID") & vbTab
	else
		RowHeaderString = "PEOPLESOFTID" & vbTab
    end if
	
	RowHeaderString = RowHeaderString & Session("Username") & vbTab & Session("NAME") & vbTab 
    RowHeaderString = RowHeaderString & vbTab & Request.ServerVariables("REMOTE_ADDR")& vbTab
	RowHeaderString = RowHeaderString & Hour(dt) & ":" & Minute(dt) & ":" & FormatNumber((Second(dt) + ms), 4) & vbTab

	WriteMyData.WriteLine(RowHeaderString & vbTab & msg)
	
	
	dim i, s, fline
	
	for i=0 to 49'Request.Form("answer").Count
		
		s = "answer[" & FormatNumber(i,0,0) & "]"
		
		fline =  Request.Form( s ) 
		
		'Response.Write( Request.Form( s ) ) 
		
		if len(fline)> 4 then
		
			'Response.Write( s & vbtab & fline & "<br />" )
			
			WriteMyData.WriteLine( s & vbtab & fline  )
			
		end if
	
	
	next 
	

	WriteMyData.Close
	
	On Error GoTo 0

end sub




Response.Buffer = true


On Error resume next


If (UCase(Request.ServerVariables("HTTP_METHOD")) = "POST") Then ' Save Form Data
	
	call AppLog("SUBMIT POST BEGIN")
	

	CALL SaveQuiz(Request.ServerVariables("REMOTE_ADDR"))


	call AppLog("SUBMIT COMPLTE")
	
	'response.Redirect("quiz.htm")
	
End If

'Prepare to Writeout Error Message
If strAlert <> "" Then 
	call AppLog("SUBMIT ALERT "&strAlert)
	strAlert = "<h3>Please try again: </h3><p>" & strAlert & "</p>"
End IF
%>

