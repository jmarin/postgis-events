# postgis-events

A tool to publish events related to operations performed on Postgis tables.
Insert, update and delete notifications are published through a websockets endpoint

## Database preparation

Here are the steps necessary to configure the tables for which you want notifications

### 1. Create inserts and updates notification function

The following function assumes there is a field called `gid` which is a primary key for the table
This field is automatically created and indexed when importing Shapefiles into Postgis with the `shp2pgsql` command.

```
CREATE OR REPLACE FUNCTION insert_update_notify() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('inserts_updates', TG_TABLE_SCHEMA || ',' || TG_TABLE_NAME || ',' || NEW.gid);
	return new;
END
$$ LANGUAGE plpgsql;
```

Note: the above function assumes the geometry column's name is `geometry`

### 2. Create deletes notification function

TBD

### 3. Create triggers to send notification events

* Inserts trigger

```
CREATE TRIGGER <table>_inserts AFTER INSERT ON <table>
FOR EACH ROW EXECUTE PROCEDURE insert_update_notify();
```

* Updates trigger

```
CREATE TRIGGER <table>_updates AFTER UPDATE ON <table>
FOR EACH ROW EXECUTE PROCEDURE insert_update_notify();
```

* Deletes trigger

TBD

### 4. Run the service and expose events through websockets

Before running the application, dependencies need to be installed by issuing: 

`npm install`

The service and sample client application can be run by entering the following (dev mode):

`node server.js`

Go to http://localhost:3000, and insert or update some data into the table for which the triggers have been configured.
You should see the geometries being modified added to the map in real time.
