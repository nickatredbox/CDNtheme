<% @Language="VBScript" %>
<!--#INCLUDE FILE="apputils.inc"-->
<%

Option Explicit 



function SaveQuiz(emailaddress)

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
	
	call AppLog("SAVE QUIZ")
	
	dt = NOW
	
	ms = timer - datediff("s", (Month(dt) & "-" & Day(dt) & "-" & Year(dt) & " 00:00:00"), now)
	
	LogFileName = "Quiz-" & emailaddress & "-" & Month(dt) & "-" & Day(dt) & "-" & Year(dt) & ".txt"
	
	LogFileDirectory = Application("LogPath") & "..\quiz\"'N.B. One level up from the problem folder
	
	call AppLog(LogFileDirectory)
	  
	'Open Text File.. If doesn't exist create it and append to it .. If exists just append to it
	Set WriteMyData = ObjMyFile.OpenTextFile(LogFileDirectory & "\" & LogFileName, 8, True)
	
	if Session("EMPLID") <> "" then
		RowHeaderString = Session("EMPLID") & vbTab
	else
		RowHeaderString = "PEOPLESOFTID" & vbTab
    end if
	

	WriteMyData.WriteLine(emailaddress & " has submited a Python Quiz" )
	
	WriteMyData.WriteLine("From  " & Request.ServerVariables("REMOTE_ADDR") )
	
	
	dim i, s, fline
	
	fline =  Request.Form( "answer[0]") 
	if len(fline)> 3 then		
		Response.Write( "answer[0]" & vbtab & fline & "<br />" )
		WriteMyData.WriteLine( "answer[0]" & vbtab & fline  )		
	end if
	
	for i = 1 to 49
		
		s = "answer[" & FormatNumber(i,0,0) & "]"
		
		fline =  Request.Form( s ) 
		
		if len(fline)> 3 then
				
			Response.Write( s & vbtab & fline & "<br />" )
			
			WriteMyData.WriteLine( s & vbtab & fline  )
			
		end if
	
	
	next 
	
	WriteMyData.Close
	
	On Error GoTo 0

	SaveQuiz = (LogFileDirectory & LogFileName )

end function


sub SendEmail(emailaddress, attachmentfile)

	call AppLog(emailaddress & " SEND EMAIL" )

	dim Mail, sender, TextBody
	
	sender = emailaddress & "@lincoln.ac.nz"

	set Mail = CreateObject("CDO.Message")

	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2

	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpserver") ="smtp.gmail.com"
	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpserverport") = 465

	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpusessl") = 1

	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 60

	 
	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate") = 1
	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendusername") ="nickatlincoln@gmail.com" 'You can also use you email address that's setup through google apps.
	Mail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendpassword") ="aq150200"

	Mail.Configuration.Fields.Update

	Mail.Subject = "Quiz Submitted by " & sender
	Mail.From = sender 'This has to be an actual email address or an alias that's setup on the gmail account you used above
	Mail.Sender = sender
	Mail.ReplyTo = sender
	Mail.To="nicholas.goodey@lincoln.ac.nz"
	Mail.Bcc="nickatlincoln@gmail.com" 'Blind Carbon Copy
	'Mail.Cc="someoneelse2@somedomain.com" 'Carbon Copy

	'**Below are different options for the Body of an email. *Only one of the below body types can be sent.
	TextBody = emailaddress & " has submited a Python Quiz"
	
	TextBody = TextBody & "From  " & Request.ServerVariables("REMOTE_ADDR")
	
	Mail.TextBody = TextBody
	
	'Mail.HTMLBody="This is an email message that accepts HTML tags”
	'Mail.CreateMHTMLBody "http://www.w3schools.com/asp/" 'Sends an email which has a body of a specified webpage
	'Mail.CreateMHTMLBody "file://c:/mydocuments/email.htm" 'Sends an email which has a body of an html file that’s stored on your computer. This MUST be on the server that this script is being served from.

	'How to add an attachment
	Mail.AddAttachment attachmentfile 'Again this must be on the server that is serving this script.

	Mail.Send
	
	call AppLog( "SEND DONE" )
	
	Set Mail = Nothing


end sub



Response.Buffer = true

On Error resume next

dim attachmentfile, emailaddress

If (UCase(Request.ServerVariables("HTTP_METHOD")) = "POST") Then ' Save Form Data
	
	AppLog("SUBMIT POST BEGIN")
	Response.Write("SUBMIT POST BEGIN<br/>")
	
	emailaddress = Request.Form("emailaddress")
	
	Response.Write(emailaddress & "<br/>")
	
	attachmentfile = SaveQuiz(emailaddress)
	
	Response.Write(attachmentfile & "<br/>")
		
	call SendEmail(emailaddress, attachmentfile)
	
	call AppLog("SUBMIT COMPLTE")
	Response.Write("SUBMIT COMPLETE<br/>")
	
	response.Redirect("theme.htm")
	
End If

%>

