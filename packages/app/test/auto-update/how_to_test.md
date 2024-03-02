1. Build "Station QA" app with `yarn run make-qa`
2. Run the dummy release server with `yarn run dummy-update-server`
3. Launch the QA app with this command: `yarn run start-qa`
4. Just after start, verify the update notification is poping
5. Close "Station QA"
6. `cat ~/Library/Caches/org.efounders.BrowserXQA.ShipIt/ShipIt_stderr.log` => verify the last log says 'Installation completed successfully'
