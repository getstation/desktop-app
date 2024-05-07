!macro customUnInstall

  ${GetParameters} $R0
  ${GetOptions} $R0 "--update" $R1
  ${If} ${Errors}

    MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Delete also user data and settings for Station?" IDNO skip
    RMDir /r "$APPDATA\Station"
    RMDir /r "$APPDATA\Stationv2"

    skip:

	${endif}

!macroend
