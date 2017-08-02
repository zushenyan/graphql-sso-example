false &&
echo "Deployment start...."



# build client
rm -rf ./public/spa/static && \
rm ./public/spa/index.html && \
cd ./client && \
yarn install && \
yarn run build && \
cd .. && \
cp -r ./client/dist/* ./public/spa

# databasemirgration
NODE_ENV=production yarn run knex migrate:latest

echo "Deployment done!"
