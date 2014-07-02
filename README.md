# postgis-events

A tool to publish events related to operations performed on Postgis tables.
Insert, update and delete notifications are published through a websockets endpoint

## Database preparation

Here are the steps necessary to configure the tables for which you want notifications

### 1. Create inserts and updates notification function

```
CREATE OR REPLACE FUNCTION insert_update_notify() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('inserts_updates', ST_AsGeoJSON(ST_Centroid(NEW.geometry), 2));
	return new;
END
$$ LANGUAGE plpgsql;
```

Note: the above function assumes the geometry column's name is `geometry`

### 2. Create deletes notification function

TODO

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

### 4. Run the service and expose events through websockets

`node server.js`

