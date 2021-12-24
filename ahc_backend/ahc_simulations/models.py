from django.db import models


"""
(DK):
- sequence_id?
- The commit field might be redundant. There is already a reference field.
- Do we support HEAD^1, HEAD~2 etc? It is unlikely any one will ever want to use such a
thing but we might want to document this for the sake of completeness.
- Do we have a many-to-one between Repository and Simulation?
"""


class Simulation(models.Model):
    """Model representing a simulation setup.

    Attributes:
        id: int
        repository: int
        sequence_id: int
        commit: string
        reference: string (HEAD/main/89F6B6...)
        reference_type: string (branch/tag/commit)
        created_at: datetime
        updated_at: datetime
    """

    pass  # TODO: Fill me with fields.


"""
(DK):
- We can clarify what sequence_id is.
- My understanding is that created/updated_at fields stand for when the user booked a
simulation run and the last time there was a change on the booking. Is this correct?
- Do result_status and exit_code signify different information?
"""


class SimulationRun(models.Model):
    """Statistics of a simulation run.

    Attributes:
        id: int
        simulation: int (simulation one-to-many)
        sequence_id: int
        started_at: datetime
        finished_at: datetime
        result_status: string
        exit_code: int (process exit code)
        log_path: path to the log of the simulation run
        created_at: datetime
        updated_at: datetime
    """

    pass  # TODO: Fill me with fields.


"""
(DK): value_float and value_int. Can we leverage Python's ducktyping here to keep 
value_float and value_int in a single field? Python's typing module allows this with 
union types (Union[FLOAT_FIELD, INT_FIELD]). Can Django do the necessary adjustments 
to implement union types in the database side? Checking the type of each metric and 
having two fields for it is both cumbersome and error prone.

If there is no simple solution to that we can leave this as it is and consider 
refactoring it in the future after weighing the pros and the cons. It can get quite 
complicated and require some research beforehand.
"""


class SimulationRunMetric(models.Model):
    """Model for metrics of a simulation run.

    Attributes:
        id: int
        simulation_run: int (simulation one-to-one)
        type: str
        name: str
        value_float: float
        value_int: int
        created_at: datetime
    """

    pass  # TODO: fill me with fields.


"""
(DK): My understanding is that there is a one-to-many relation between metrics and 
their aliases. If this is the case alias model and the schema should reflect this.
Also, It is not very clear to me what updated_at field signifies.
"""


class SimulationRunMetricAlias(models.Model):
    """Aliases for simulation metrics.

    Attributes:
        id: int
        simulation_run: int (simulation one-to-many)
        type: string
        name: string
        alias: string
        created_at: datetime
        updated_at: datetime
    """

    pass  # TODO: Fill me with fields.


"""
(DK):
- What is the difference between the activity log and the log file pointed by 
SimulationRun.log_path?
- What does SimulationActivityLog.target represent?
- type?
"""


class SimulationActivityLog(models.Model):
    """TODO: describe me.

    Attributes:
        user: int (user one-to-many)?
        simulation: int (simulation ?-to-?)
        type: string
        target: string
        created_at: datetime
        updated_at: datetime
    """

    pass  # TODO: Fill me.
