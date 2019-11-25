Mint a Firebase Authentication custom token that contains  
additional information about a group member (such as a group ID) 
https://firebase.google.com/docs/storage/security/user-security

Add the group ID, say 'ADMIN', to both me and irene.  
Use this group ID in the rules for firestore and storage.  
Should be able to delete the users table.  

Create a image_refs firestore table, this contains image_name and storage_ref  
for static images. This will make it easier to get RixsonDev working as  
currently the static image refs are hardcoded in the app.