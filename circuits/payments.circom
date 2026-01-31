pragma circom 2.2.3;

include "../math/mimcsponge.circom";

// ========================
// Payments Circuit Template
// ========================
template Payments(total_payments) {
    signal input amounts[total_payments];    
    signal input receivers[total_payments];  
    signal output root;  

    var total_leaves = total_payments;
    var total_nodes = 2 * total_leaves - 1;
    signal merkle_tree[total_nodes];
    var start_leaves_pos = total_leaves - 1;

    component mimcsponge_components[total_nodes];

    for (var i = total_nodes - 1; i >= 0; i--) {
        if (i >= start_leaves_pos) {
            mimcsponge_components[i] = MiMCSponge(2, 220, 1);
            mimcsponge_components[i].k <== 0;
            mimcsponge_components[i].ins[0] <== receivers[i - start_leaves_pos];
            mimcsponge_components[i].ins[1] <== amounts[i - start_leaves_pos];
        } else {
            mimcsponge_components[i] = MiMCSponge(2, 220, 1);
            mimcsponge_components[i].k <== 0;
            mimcsponge_components[i].ins[0] <== merkle_tree[2*i + 1];
            mimcsponge_components[i].ins[1] <== merkle_tree[2*i + 2];
        }
        merkle_tree[i] <== mimcsponge_components[i].outs[0];
    }

    root <== merkle_tree[0];
}

component main {public [amounts, receivers]} = Payments(4);