var config = {};
var tablePrefix = "gestalt_";
var urlBase = "/api";

// connection string
config.connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.split(",")[0] + "://" + process.env.DATABASE_URL.split(",")[1] + ":" + process.env.DATABASE_URL.split(",")[3] + "@" + process.env.DATABASE_URL.split(",")[2] + "/" + process.env.DATABASE_URL.split(",")[0] : "";

// API 
config.workspace = {};
config.story = {};
config.persona = {};
config.visualization = {};



/////////////////
/// WORKSPACE ///
/////////////////

var workspaceBase = urlBase + "/workspace";

// workspace-1-get-all-workspaces.route.js
config.workspace.allWorkspaces = {
    
    route: workspaceBase + "/persona/:persona",
    
    query: [
        "select w.id,w.persona_id,w.url_name,w.is_default,wn.name,p.url_name as default_panel,v.directive as default_vis,array_agg(row_to_json(pl)) as panels from " + tablePrefix + "workspace w left join " + tablePrefix + "workspace_name wn on wn.id = w.workspace_name_id left join " + tablePrefix + "workspace_panel wp on wp.workspace_id = w.id left join " + tablePrefix + "panel p on p.id = wp.panel_id left join " + tablePrefix + "persona_panel_story pps on pps.panel_id = wp.panel_id and pps.persona_id = ",
		" left join " + tablePrefix + "story s on s.id = pps.story_id left join " + tablePrefix + "vis v on v.id = s.vis_id left join (select wp.panel_id, wp.workspace_id, wp.is_default, pl.name, pl.url_name, w.persona_id, v.directive as visualization from " + tablePrefix + "workspace_panel wp left join " + tablePrefix + "persona_panel_story pps on pps.panel_id = wp.panel_id and pps.persona_id = ",
		" left join " + tablePrefix + "story s on s.id = pps.story_id left join " + tablePrefix + "vis v on v.id = s.vis_id left join " + tablePrefix + "panel pl on pl.id = wp.panel_id left join " + tablePrefix + "workspace w on w.id = wp.workspace_id) pl on pl.workspace_id = w.id where w.persona_id = ",
		" and wp.is_default = true group by w.id,w.persona_id,w.url_name,w.url_name,wn.name,p.url_name,v.directive order by wn.name asc;"
    ]
    
};

// workspace-2-get-single-workspace.route.js
config.workspace.singleWorkspace = {
    
    route: workspaceBase + "/:workspace",
    
    query: [
        "SELECT DISTINCT ON (w.id) w.id, wn.name, p.name AS persona_name, w.url_name FROM " + tablePrefix + "workspace AS w LEFT JOIN " + tablePrefix + "workspace_name AS wn ON w.workspace_name_id = wn.id LEFT JOIN " + tablePrefix + "persona AS p ON w.persona_id = p.id WHERE w.id IS NOT NULL AND w.url_name = '",
		"' ORDER BY w.id;"
    ]
    
};

// workspace-3-get-all-panels-single-workspace.route.js
config.workspace.panelsSingleWorkspace = {
    
    route: workspaceBase + "/:workspace/panels/:persona",
    
    query: [
        "select pps.panel_id,p.url_name,w.url_name as workspace_url_name,p.name,pps.persona_id,v.directive as default_vis from " + tablePrefix + "persona_panel_story pps left join " + tablePrefix + "workspace_panel wp on wp.panel_id = pps.panel_id left join " + tablePrefix + "story s on s.id = pps.story_id left join " + tablePrefix + "vis v on v.id = s.vis_id left join " + tablePrefix + "panel p on p.id = wp.panel_id left join " + tablePrefix + "workspace w on w.id = wp.workspace_id where w.url_name = '",
		"' and pps.persona_id = ",
		";"
    ]
    
};



/////////////////
///// STORY /////
/////////////////

var storyBase = urlBase + "/data/story";

// story-1-get-all-stories-single-panel-persona.route.js
config.story.allStoriesSinglePanelPersona = {
    
    route: storyBase + "/persona/:persona/panel/:panel",
    
    query: [
        "select pps.*,s.name,s.url_name,array_agg(row_to_json(si)) as ideas from " + tablePrefix + "persona_panel_story pps left join " + tablePrefix + "story s on s.id = pps.story_id left join (select sti.*,array_agg(row_to_json(c)) as controls from " + tablePrefix + "story_idea sti left join (select sac.*,case when sac.story_action_id = 1 then g.name when sac.story_action_id = 2 then v.name else f.name end as name from " + tablePrefix + "story_action_control sac left join " + tablePrefix + "group g on g.id = sac.name_id left join " + tablePrefix + "vertex v on v.id = sac.name_id left join " + tablePrefix + "flow f on f.id = sac.name_id) c on c.story_action_id = sti.action_id group by sti.id) si on si.story_id = pps.story_id where pps.persona_id = ",
		" and pps.panel_id = ",
		" group by pps.id,s.name,s.url_name;"
    ]
    
};

// story-2-get-story-idea-metrics-single-panel-persona.route.js
config.story.storyIdeaMetricsSinglePanelPersona = {
    
    route: storyBase + "/idea/:idea/metric/:control",
    
    query: [
        "select sac.id,sim.label,sim.description,si.id as story_idea_id,case when sac.story_action_id = 1 then g.name when sac.story_action_id = 2 then v.name else f.name end as control_name,sa.name as action_name,sim.name as metric_name,array_agg(row_to_json(m)) as metrics from " + tablePrefix + "story_action_control sac left join " + tablePrefix + "story_action sa on sa.id = sac.story_action_id left join " + tablePrefix + "story_idea si on si.action_id = sac.story_action_id left join " + tablePrefix + "group g on g.id = sac.name_id left join " + tablePrefix + "vertex v on v.id = sac.name_id left join " + tablePrefix + "flow f on f.id = sac.name_id left join " + tablePrefix + "story_idea_metric sim on sim.control_id = sac.id left join (select * from " + tablePrefix + "story_idea_metric_value) m on m.control_id = sac.id where si.id = ",
		" and sac.id = ",
		" group by sac.id,sim.label,sim.description,si.id,g.name,v.name,f.name,sa.name,sim.name;"
    ]
    
};



/////////////////
//// PERSONA ////
/////////////////

var personaBase = urlBase + "/persona";

// persona-1-get-all-personas.route.js
config.persona.allPersonas = {
    
    route: personaBase,
    
    query: [
        "select * from " + tablePrefix + "persona;"
    ]
    
};



/////////////////////
/// VISUALIZATION ///
/////////////////////

var visualizationBase = urlBase + "/data/visualization";

// visualization-1-node-groups.route.js
config.visualization.nodeGroups = {
    
    route: visualizationBase + "/countries/groups",
    
    query: [
        "select g.*,array_agg(row_to_json(s)) as subgroups from " + tablePrefix + "group g left join (select distinct on (sg.name_id, sg.group_id) sg.name_id, sg.group_id,case when gt.id = 1 then gn.name else sgn.name end as name,case when gt.id = 1 then gt.id || '_' || gn.id else gt.id || '_' || sgn.id end as id,geo.hexagon_center_x as center_x,geo.hexagon_center_y as center_y,array_agg(row_to_json(n)) as nodes from " + tablePrefix + "subgroup sg left join " + tablePrefix + "geography_name gn on gn.id = sg.name_id left join " + tablePrefix + "subgroup_name sgn on sgn.id = sg.name_id left join " + tablePrefix + "group g on g.id = sg.group_id left join " + tablePrefix + "group_type gt on gt.id = g.type_id left join " + tablePrefix + "geography geo on geo.name_id = sg.name_id and gt.id = 1 left join (select gn.name,gcy.id,gcy.iso2code as iso from " + tablePrefix + "country gcy left join " + tablePrefix + "geography_name gn on gn.id = gcy.name_id) n on n.id = sg.country_id group by sg.name_id,sg.group_id,gn.name,sgn.name,geo.hexagon_center_x,geo.hexagon_center_y,gt.id,g.id,gn.id,sgn.id) s on s.group_id = g.id group by g.id"
    ]
    
};

// visualization-2-geojson-countries.route.js
config.visualization.geojson = {
    
    route: visualizationBase + "/geojson/:grid",
    
    query: [
        "select 'FeatureCollection' as type,array_agg(row_to_json(r)) as features from (with t as (select 'Feature'::text) select t.text as type,row_to_json(f) as properties,row_to_json(c) as geometry from t," + tablePrefix + "geography geo left join (select geo.id,gn.name,cy.iso2code as iso from " + tablePrefix + "geography geo left join " + tablePrefix + "geography_name gn on gn.id = geo.name_id left join " + tablePrefix + "country cy on cy.id = geo.name_id) f on f.id = geo.id left join (with t as (select 'Polygon'::text) select t.text as type,geo.hexagon_polygon as coordinates from t," + tablePrefix + "geography geo) c on c.coordinates = geo.hexagon_polygon where geo.hexagon_polygon is not null ) r group by type;"
    ]
    
};

// visualization-3-grouped-countries.route.js
config.visualization.groupedCountries = {
    
    route: visualizationBase + "/:table",
    
    query: [
        "select distinct on (gn.name) gn.name,cy.iso2code as iso,cy.id,count(distinct cdis.target_id) as count from " + tablePrefix + "country cy left join " + tablePrefix + "geography_name gn on gn.id = cy.name_id left join " + tablePrefix + "geography geo on geo.name_id = cy.name_id left join " + tablePrefix + "cdis cdis on source_id = cy.id group by gn.name,cy.iso2code,cy.id"
    ]
    
};

// visualization-4-node-flows.route.js
config.visualization.nodeFlows = {
    
    route: visualizationBase + "/flows/unique_targets/:sourceId",
    
    query: [
        "select gn.name as source_name,cy.iso2code as source,gnt.name as target_name,cyt.iso2code as target,cy.id as source_id,count(cdis.target_id) as value from " + tablePrefix + "cdis cdis left join " + tablePrefix + "geography_name gn on gn.id = cdis.source_id left join " + tablePrefix + "geography_name gnt on gnt.id = cdis.target_id left join " + tablePrefix + "country cy on cy.id = cdis.source_id left join " + tablePrefix + "country cyt on cyt.id = cdis.target_id where source_id = ",
        " and cyt.iso2code is not null group by gn.name,cy.iso2code,cy.id,gnt.name,cyt.iso2code"
    ]
    
};

// visualization-5-dynamic-directives.route.js
config.visualization.dynamicDirectives = {
    
    route: visualizationBase + "/angular/directives/:visual",
    
    query: [
        "select * from " + tablePrefix + "vis where id = ",
		";"
    ]
    
};



module.exports = config;